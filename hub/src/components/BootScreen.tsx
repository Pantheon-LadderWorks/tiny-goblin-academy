import React from 'react'
import bootSplash from '../../../assets/studio/glyphforge-games/glyphforge-games-boot-splash-concept.png'

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  return (
    <div 
      className="boot-screen hero-boot"
      style={{
        backgroundImage: `url(${bootSplash})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="boot-overlay-c">
        <h1 className="boot-title-hero" data-typography-role="academy-title">Tiny Goblin Academy</h1>
        
        <div className="boot-lower-status">
          <div className="boot-loading-phrase" data-typography-role="body-instruction">Opening the Academy...</div>
          
          {/* Optional manual button if they don't want to wait for the timer in App.tsx */}
          <button 
            className="boot-skip-button modern"
            data-typography-role="compact-label"
            onClick={onComplete}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
