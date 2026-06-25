import React from 'react'

export const CreditsPanel: React.FC = () => {
  return (
    <div className="credits-panel">
      <p className="credits-text">Pantheon LadderWorks / Glyphforge Games (Draft)</p>
      <p className="credits-text" style={{ fontSize: '0.7rem', marginTop: '4px' }}>
        See public repo governance docs for licensing details.
      </p>
    </div>
  )
}
