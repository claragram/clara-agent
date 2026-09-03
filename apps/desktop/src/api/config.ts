import type {
  ConfigSchemaResponse,
  CustomEndpointsResponse,
  CustomEndpointUpdate,
  CustomEndpointValidationResponse,
  EnvVarInfo,
  ClaraConfig,
  ClaraConfigRecord,
  LogsResponse,
  OAuthPollResponse,
  OAuthProvidersResponse,
  OAuthStartResponse,
  OAuthSubmitResponse,
  StatusResponse
} from '@/types/clara'

import { capabilityScoped, claraApi, type ProfileScope, profileScoped, STARTUP_REQUEST_TIMEOUT_MS } from './client'

export function getStatus(): Promise<StatusResponse> {
  return claraApi<StatusResponse>({
    ...profileScoped(),
    path: '/api/status'
  })
}

export function getLogs(params: {
  component?: string
  file?: string
  level?: string
  lines?: number
  search?: string
}): Promise<LogsResponse> {
  const query = new URLSearchParams()

  if (params.file) {
    query.set('file', params.file)
  }

  if (typeof params.lines === 'number') {
    query.set('lines', String(params.lines))
  }

  if (params.level && params.level !== 'ALL') {
    query.set('level', params.level)
  }

  if (params.component && params.component !== 'all') {
    query.set('component', params.component)
  }

  if (params.search) {
    query.set('search', params.search)
  }

  const suffix = query.toString()

  return claraApi<LogsResponse>({
    ...profileScoped(),
    path: suffix ? `/api/logs?${suffix}` : '/api/logs'
  })
}

export function getClaraConfig(profile?: string): Promise<ClaraConfig> {
  return claraApi<ClaraConfig>({
    ...profileScoped(profile),
    path: '/api/config',
    timeoutMs: STARTUP_REQUEST_TIMEOUT_MS
  })
}

export function getClaraConfigRecord(profile?: ProfileScope): Promise<ClaraConfigRecord> {
  return window.claraDesktop.api<ClaraConfigRecord>({
    ...capabilityScoped(profile),
    path: '/api/config'
  })
}

export function getClaraConfigDefaults(): Promise<ClaraConfigRecord> {
  return claraApi<ClaraConfigRecord>({
    ...profileScoped(),
    path: '/api/config/defaults',
    timeoutMs: STARTUP_REQUEST_TIMEOUT_MS
  })
}

export function getClaraConfigSchema(profile?: null | string): Promise<ConfigSchemaResponse> {
  return claraApi<ConfigSchemaResponse>({
    ...profileScoped(profile),
    path: '/api/config/schema'
  })
}

export function saveClaraConfig(config: ClaraConfigRecord, profile?: null | string): Promise<{ ok: boolean }> {
  return claraApi<{ ok: boolean }>({
    ...profileScoped(profile),
    path: '/api/config',
    method: 'PUT',
    body: { config }
  })
}

/** Capability-scoped counterpart of saveClaraConfig — writes the config of
 *  the profile/connection the Capabilities scope selector points at (possibly
 *  on another registered gateway), mirroring getClaraConfigRecord. */
export function saveClaraConfigRecord(config: ClaraConfigRecord, profile?: ProfileScope): Promise<{ ok: boolean }> {
  return window.claraDesktop.api<{ ok: boolean }>({
    ...capabilityScoped(profile),
    path: '/api/config',
    method: 'PUT',
    body: { config }
  })
}

export function getEnvVars(profile?: null | string): Promise<Record<string, EnvVarInfo>> {
  return claraApi<Record<string, EnvVarInfo>>({
    ...profileScoped(profile),
    path: '/api/env'
  })
}

export function setEnvVar(key: string, value: string, profile?: ProfileScope): Promise<{ ok: boolean }> {
  return window.claraDesktop.api<{ ok: boolean }>({
    ...capabilityScoped(profile),
    path: '/api/env',
    method: 'PUT',
    body: { key, value }
  })
}

export function deleteEnvVar(key: string, profile?: ProfileScope): Promise<{ ok: boolean }> {
  return window.claraDesktop.api<{ ok: boolean }>({
    ...capabilityScoped(profile),
    path: '/api/env',
    method: 'DELETE',
    body: { key }
  })
}

export function revealEnvVar(key: string, profile?: ProfileScope): Promise<{ key: string; value: string }> {
  return window.claraDesktop.api<{ key: string; value: string }>({
    ...capabilityScoped(profile),
    path: '/api/env/reveal',
    method: 'POST',
    body: { key }
  })
}

export function validateProviderCredential(
  key: string,
  value: string,
  apiKey?: string
): Promise<{ ok: boolean; reachable: boolean; message: string; models?: string[] }> {
  return claraApi<{ ok: boolean; reachable: boolean; message: string; models?: string[] }>({
    ...profileScoped(),
    path: '/api/providers/validate',
    method: 'POST',
    body: { key, value, api_key: apiKey ?? '' }
  })
}

export function getCustomEndpoints(): Promise<CustomEndpointsResponse> {
  return claraApi<CustomEndpointsResponse>({
    ...profileScoped(),
    path: '/api/providers/custom-endpoints'
  })
}

export function saveCustomEndpoint(endpoint: CustomEndpointUpdate): Promise<CustomEndpointsResponse> {
  return claraApi<CustomEndpointsResponse>({
    ...profileScoped(),
    path: '/api/providers/custom-endpoints',
    method: 'POST',
    body: endpoint
  })
}

export function validateCustomEndpoint(endpoint: CustomEndpointUpdate): Promise<CustomEndpointValidationResponse> {
  return claraApi<CustomEndpointValidationResponse>({
    path: '/api/providers/custom-endpoints/validate',
    method: 'POST',
    body: endpoint
  })
}

export function activateCustomEndpoint(id: string): Promise<{ ok: boolean; provider: string; model: string }> {
  return claraApi<{ ok: boolean; provider: string; model: string }>({
    ...profileScoped(),
    path: `/api/providers/custom-endpoints/${encodeURIComponent(id)}/activate`,
    method: 'POST'
  })
}

export function deleteCustomEndpoint(id: string): Promise<CustomEndpointsResponse> {
  return claraApi<CustomEndpointsResponse>({
    ...profileScoped(),
    path: `/api/providers/custom-endpoints/${encodeURIComponent(id)}`,
    method: 'DELETE'
  })
}

export function listOAuthProviders(): Promise<OAuthProvidersResponse> {
  return claraApi<OAuthProvidersResponse>({
    ...profileScoped(),
    path: '/api/providers/oauth'
  })
}

export function disconnectOAuthProvider(providerId: string): Promise<{ ok: boolean; provider: string }> {
  return claraApi<{ ok: boolean; provider: string }>({
    ...profileScoped(),
    path: `/api/providers/oauth/${encodeURIComponent(providerId)}`,
    method: 'DELETE'
  })
}

export function startOAuthLogin(providerId: string, profile?: ProfileScope): Promise<OAuthStartResponse> {
  return window.claraDesktop.api<OAuthStartResponse>({
    ...capabilityScoped(profile),
    path: `/api/providers/oauth/${encodeURIComponent(providerId)}/start`,
    method: 'POST',
    body: {}
  })
}

export function submitOAuthCode(providerId: string, sessionId: string, code: string): Promise<OAuthSubmitResponse> {
  return claraApi<OAuthSubmitResponse>({
    ...profileScoped(),
    path: `/api/providers/oauth/${encodeURIComponent(providerId)}/submit`,
    method: 'POST',
    body: { session_id: sessionId, code }
  })
}

export function pollOAuthSession(
  providerId: string,
  sessionId: string,
  profile?: ProfileScope
): Promise<OAuthPollResponse> {
  return window.claraDesktop.api<OAuthPollResponse>({
    ...capabilityScoped(profile),
    path: `/api/providers/oauth/${encodeURIComponent(providerId)}/poll/${encodeURIComponent(sessionId)}`
  })
}

export function cancelOAuthSession(sessionId: string): Promise<{ ok: boolean }> {
  return claraApi<{ ok: boolean }>({
    ...profileScoped(),
    path: `/api/providers/oauth/sessions/${encodeURIComponent(sessionId)}`,
    method: 'DELETE'
  })
}
