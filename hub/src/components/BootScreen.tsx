import React from 'react'
import bootSplash from '../../../assets/studio/glyphforge-games/glyphforge-games-boot-splash-concept.png'

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  return (
    <div className="boot-screen">
      <img src={bootSplash} alt="Glyphforge Games Concept Splash" style={{ maxWidth: '400px', marginBottom: '2rem' }} />
      <div className="studio-mark">Glyphforge Games (Draft)</div>
      <div className="academy-identity">Tiny Goblin Academy</div>
      <div className="loading-phrase">Opening the Academy...</div>
      
      {/* Optional manual button if they don't want to wait for the timer in App.tsx */}
      <button 
        className="boot-skip-button"
        onClick={onComplete}
      >
        Skip
      </button>
    </div>
  )
}
