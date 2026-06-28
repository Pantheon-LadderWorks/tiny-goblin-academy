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
        <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
          <li><strong>Listed:</strong> {game.listed ? 'Yes' : 'No'}</li>
          <li><strong>Workspace Member:</strong> {game.workspaceMember ? 'Yes' : 'No'}</li>
          <li><strong>Source Available:</strong> {game.sourceAvailable ? 'Yes' : 'No'}</li>
          <li><strong>Dependencies Installed:</strong> {game.dependenciesInstalled ? 'Yes' : 'No'}</li>
          <li><strong>Dev Runnable:</strong> {game.devRunnable ? 'Yes' : 'No'}</li>
          <li><strong>Build Available:</strong> {game.buildAvailable ? 'Yes' : 'No'}</li>
          <li><strong>Playable Available:</strong> {game.playableAvailable ? 'Yes' : 'No'}</li>
          <li><strong>Playable Mode:</strong> {game.playableMode}</li>
          <li><strong>Installed:</strong> {game.installed ? 'Yes' : 'No'}</li>
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
