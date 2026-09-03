# Bundled plugins

Drop a `<name>/plugin.{ts,tsx}` here that default-exports a `ClaraPlugin` and
it registers automatically at boot (vite glob in `../contrib/plugins.ts`), with
the same inventory + live enable/disable contract as runtime plugins.

Keep this tree for real shipped plugins (and the small authoring fixtures that
dogfood the SDK). One-off demos that rebuild a core chrome piece 1:1 do not
belong here — they double the UI and confuse Settings ▸ Plugins. Publish those
in the companion
[`clara-example-plugins`](https://github.com/claraprise/clara-example-plugins)
repo instead.

User- and agent-authored plugins load at runtime from
`$CLARA_HOME/desktop-plugins/<name>/plugin.js` (the disk door) — see the
`clara-desktop-plugins` skill.
