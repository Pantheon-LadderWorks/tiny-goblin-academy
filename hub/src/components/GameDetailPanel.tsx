import React, { useEffect } from 'react'
import { GameManifest } from '../data/tier1Roster'
import { hubIconRegions } from '../data/hubIconRegions'
import { SpriteFrame } from './SpriteFrame'

interface GameDetailPanelProps {
  game: GameManifest | null;
  onClose: () => void;
}

export const GameDetailPanel: React.FC<GameDetailPanelProps> = ({ game, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!game) {
    return null;
  }

  const iconRegion = hubIconRegions.find(r => r.gameId === game.id)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
        {iconRegion && (
          <div className="modal-icon-container">
            <SpriteFrame 
              sourceRect={iconRegion.sourceRect} 
              alt={iconRegion.label}
              className="modal-game-icon"
            />
          </div>
        )}
        <h2 className="detail-title">{game.title}</h2>
      
      <div className="detail-section">
        <h4>Level {game.level} • Tier {game.tier}</h4>
        <p>{game.shortDescription}</p>
      </div>
      
      <div className="detail-section">
        <h4>Core Lesson</h4>
        <p>{game.coreLesson}</p>
      </div>

      <div className="detail-section">
        <h4>Controls</h4>
        <p>{game.controls}</p>
      </div>

      <div className="detail-section">
        <h4>Status: {game.displayStatus}</h4>
        <ul>
          <li>Source Available: {game.sourceAvailable ? 'Yes' : 'No'}</li>
          <li>Dev Runnable: {game.devRunnable ? 'Yes' : 'No'}</li>
          <li>Build Available: {game.buildAvailable ? 'Yes' : 'No'}</li>
          <li>Playable Available: {game.playableAvailable ? 'Yes' : 'No'}</li>
          <li>Playable Mode: {game.playableMode}</li>
        </ul>
      </div>

      {game.sourcePath && (
        <div className="detail-section">
          <h4>Source Path</h4>
          <p><code className="source-path">{game.sourcePath}</code></p>
        </div>
      )}

      {game.restorationDeferred && (
        <div className="deferred-note">
          <strong>Restoration Deferred:</strong> Source restoration deferred until Hub/package model is ready.
        </div>
      )}

      {!game.restorationDeferred && (
        <div className="detail-section">
          <h4>Notes</h4>
          <p>{game.notes}</p>
        </div>
      )}
      
      <div className="action-bar">
        <p className="launch-warning">Launch not implemented in this hub build.</p>
        <button className="launch-btn" disabled>
          Launch (Not Implemented)
        </button>
      </div>
      </div>
    </div>
  )
}
