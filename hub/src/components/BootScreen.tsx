import React from 'react'

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  return (
    <div className="boot-screen">
      <div className="studio-mark">Pantheon LadderWorks / Glyphforge Games (Draft)</div>
      <div className="academy-identity">Tiny Goblin Academy</div>
      <div className="loading-phrase">Opening the Academy...</div>
      
      {/* Optional manual button if they don't want to wait for the timer in App.tsx */}
      <button 
        style={{ marginTop: '2rem', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', cursor: 'pointer' }}
        onClick={onComplete}
      >
        Skip
      </button>
    </div>
  )
}
