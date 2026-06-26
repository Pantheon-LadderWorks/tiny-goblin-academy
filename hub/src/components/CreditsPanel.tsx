import React from 'react'

export const CreditsPanel: React.FC = () => {
  return (
    <div className="credits-panel">
      <p className="credits-text"><strong>Glyphforge Games (Draft)</strong></p>
      <div className="credits-notes">
        <p>✓ Workspace install complete</p>
        <p>✓ Dependency graph uses root pnpm workspace</p>
        <p>ℹ Launcher/install runtime is future work</p>
      </div>
    </div>
  )
}
