import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { getActionStatus, getComputerUseStatus, grantComputerUsePermissions } from '@/clara'
import { useI18n } from '@/i18n'
import { AlertTriangle, Check, ExternalLink, Loader2, RefreshCw, X } from '@/lib/icons'
import { upsertDesktopActionTask } from '@/store/activity'
import { notify, notifyError } from '@/store/notifications'
import type { ComputerUseStatus } from '@/types/clara'

import { Pill } from './primitives'

interface ComputerUsePanelProps {
  /** Re-read the parent toolset list after a permission/install change so the
   *  "Configured / Needs keys" pill stays in sync. */
  onConfiguredChange?: () => void
}

// Per-OS one-liner shown when there's no TCC grant flow (Windows/Linux). macOS
// drives the permission rows instead, so it has no entry here.
const PLATFORM_NOTE: Record<string, { en: string; fr: string }> = {
  linux: {
    en: 'Drives your desktop via the X11/XWayland accessibility stack — no permission prompt.',
    fr: 'Contrôle votre bureau via la pile d\'accessibilité X11/XWayland — aucune demande d\'autorisation.'
  },
  win32: {
    en: 'First run may trigger a Windows SmartScreen prompt for the cua-driver UIAccess worker — allow it.',
    fr: 'La première exécution peut déclencher une invite Windows SmartScreen pour le processus UIAccess de cua-driver — autorisez-le.'
  }
}

function tone(granted: boolean | null) {
  return granted === true ? 'primary' : 'muted'
}

function GrantIcon({ granted }: { granted: boolean | null }) {
  const Icon = granted === true ? Check : granted === false ? X : AlertTriangle

  return <Icon className="size-3" />
}

function PermissionRow({ granted, label, hint, isFr }: { granted: boolean | null; label: string; hint: string; isFr?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background/55 p-2.5">
      <div className="min-w-0">
        <span className="text-sm font-medium">{label}</span>
        <p className="mt-0.5 text-[0.7rem] text-muted-foreground">{hint}</p>
      </div>
      <Pill tone={tone(granted)}>
        <GrantIcon granted={granted} />
        {granted === true ? (isFr ? 'Accordé' : 'Granted') : granted === false ? (isFr ? 'Non accordé' : 'Not granted') : (isFr ? 'Inconnu' : 'Unknown')}
      </Pill>
    </div>
  )
}

/**
 * Cross-platform Computer Use preflight card.
 *
 * cua-driver runs on macOS, Windows, and Linux, but readiness differs: macOS
 * needs two TCC grants (Accessibility + Screen Recording) that attach to
 * cua-driver's own `com.trycua.driver` identity — not Clara — and are
 * requested via `cua-driver permissions grant` (dialog attributed to
 * CuaDriver). Windows/Linux have no TCC toggles, so readiness is driver health
 * from `cua-driver doctor`. The backend folds both into one `ready` signal.
 *
 * Binary install/upgrade stays in the cua-driver provider's post-setup runner
 * below this card (the generic ToolsetConfigPanel).
 */
export function ComputerUsePanel({ onConfiguredChange }: ComputerUsePanelProps) {
  const { locale } = useI18n()
  const isFr = locale === 'fr'
  const [status, setStatus] = useState<ComputerUseStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [granting, setGranting] = useState(false)
  const activeRef = useRef(false)

  const refresh = useCallback(async () => {
    try {
      setStatus(await getComputerUseStatus())
    } catch (err) {
      notifyError(err, isFr ? 'Impossible de lire le statut de l\'utilisation de l\'ordinateur' : 'Could not read Computer Use status')
    } finally {
      setLoading(false)
    }
  }, [isFr])

  // eslint-disable-next-line no-restricted-syntax -- legitimate non-atom ref write (see eslint rule comment)
  useEffect(() => {
    activeRef.current = true
    void refresh()

    return () => void (activeRef.current = false)
  }, [refresh])

  const grant = useCallback(async () => {
    setGranting(true)

    try {
      const started = await grantComputerUsePermissions()

      if (!started.ok) {
        notifyError(new Error('spawn failed'), isFr ? 'Impossible de demander les autorisations' : 'Could not request permissions')

        return
      }

      notify({
        kind: 'info',
        title: isFr ? 'Approuver dans les Réglages Système' : 'Approve in System Settings',
        message: isFr
          ? 'macOS affichera une boîte de dialogue d\'autorisation pour CuaDriver. Approuvez-la, puis revenez ici.'
          : 'macOS will show a permission dialog attributed to CuaDriver. Approve it, then return here.'
      })

      // The driver waits for the user to flip the switch — poll until it exits.
      for (let attempt = 0; attempt < 150 && activeRef.current; attempt += 1) {
        await new Promise(resolve => window.setTimeout(resolve, 1500))

        if (!activeRef.current) {
          break
        }

        const polled = await getActionStatus(started.name, 200)
        upsertDesktopActionTask(polled)

        if (!polled.running) {
          break
        }
      }

      if (activeRef.current) {
        await refresh()
        onConfiguredChange?.()
      }
    } catch (err) {
      if (activeRef.current) {
        notifyError(err, isFr ? 'Impossible de demander les autorisations' : 'Could not request permissions')
      }
    } finally {
      if (activeRef.current) {
        setGranting(false)
      }
    }
  }, [isFr, onConfiguredChange, refresh])

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        {isFr ? 'Vérification du statut de l\'utilisation de l\'ordinateur…' : 'Checking Computer Use status…'}
      </div>
    )
  }

  if (!status) {
    return null
  }

  if (!status.platform_supported) {
    return (
      <p className="px-1 text-xs text-muted-foreground">
        {isFr
          ? `L'utilisation de l'ordinateur n'est pas prise en charge sur cette plateforme (${status.platform}).`
          : `Computer Use isn't supported on this platform (${status.platform}).`}
      </p>
    )
  }

  if (!status.installed) {
    return (
      <p className="px-1 text-xs text-muted-foreground">
        {isFr
          ? 'Installez le moteur cua-driver ci-dessous pour contrôler cette machine.'
          : 'Install the cua-driver backend below to drive this machine.'}
        {status.can_grant && (isFr ? ' Accordez ensuite l\'Accessibilité et l\'Enregistrement de l\'écran ici.' : ' Then grant Accessibility and Screen Recording here.')}
      </p>
    )
  }

  const failingChecks = status.checks.filter(c => c.status !== 'ok')

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="min-w-0">
          {status.can_grant ? (
            <p className="text-[0.72rem] text-muted-foreground">
              {isFr
                ? 'Les autorisations s\'associent à l\'identité de CuaDriver (com.trycua.driver), pas à Clara — la boîte de dialogue est donc attribuée au processus qui pilote votre Mac.'
                : 'Grants attach to CuaDriver\'s own identity (com.trycua.driver), not Clara — so the dialog is attributed to the process that drives your Mac.'}
            </p>
          ) : (
            <p className="text-[0.72rem] text-muted-foreground">{PLATFORM_NOTE[status.platform]?.[isFr ? 'fr' : 'en'] ?? ''}</p>
          )}
          {status.version && <p className="text-[0.68rem] text-muted-foreground/80">{status.version}</p>}
        </div>
        <Button onClick={() => void refresh()} size="sm" variant="text">
          <RefreshCw className="size-3.5" />
          {isFr ? 'Revérifier' : 'Recheck'}
        </Button>
      </div>

      {status.can_grant ? (
        <>
          <PermissionRow
            granted={status.accessibility}
            hint={isFr ? 'Permet à cua-driver d\'envoyer des clics, des frappes et de lire l\'arborescence d\'accessibilité.' : 'Lets cua-driver post clicks, keystrokes, and read the accessibility tree.'}
            isFr={isFr}
            label={isFr ? 'Accessibilité' : 'Accessibility'}
          />
          <PermissionRow
            granted={status.screen_recording}
            hint={isFr ? 'Permet à cua-driver de capturer des fenêtres d\'applications.' : 'Lets cua-driver capture screenshots of app windows.'}
            isFr={isFr}
            label={isFr ? 'Enregistrement de l\'écran' : 'Screen Recording'}
          />
        </>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background/55 p-2.5">
          <span className="text-sm font-medium">{isFr ? 'Santé du pilote' : 'Driver health'}</span>
          <Pill tone={tone(status.ready)}>
            <GrantIcon granted={status.ready} />
            {status.ready === true ? (isFr ? 'Prêt' : 'Ready') : status.ready === false ? (isFr ? 'Non prêt' : 'Not ready') : (isFr ? 'Inconnu' : 'Unknown')}
          </Pill>
        </div>
      )}

      {failingChecks.map(c => (
        <p className="px-1 text-[0.7rem] text-muted-foreground" key={c.label}>
          <AlertTriangle className="mr-1 inline size-3" />
          {c.label}: {c.message}
        </p>
      ))}

      {status.error && (
        <p className="px-1 text-[0.7rem] text-muted-foreground">
          <AlertTriangle className="mr-1 inline size-3" />
          {status.error}
        </p>
      )}

      {status.ready ? (
        <div className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
          <Check className="size-3.5" />
          {isFr
            ? 'L\'utilisation de l\'ordinateur est prête. Demandez à l\'agent de capturer une application et de naviguer.'
            : 'Computer Use is ready. Ask the agent to capture an app and click around.'}
        </div>
      ) : (
        status.can_grant && (
          <Button disabled={granting} onClick={() => void grant()} size="sm">
            {granting ? <Loader2 className="size-3.5 animate-spin" /> : <ExternalLink className="size-3.5" />}
            {granting ? (isFr ? 'En attente d\'approbation…' : 'Waiting for approval…') : (isFr ? 'Accorder les autorisations' : 'Grant permissions')}
          </Button>
        )
      )}
    </div>
  )
}
