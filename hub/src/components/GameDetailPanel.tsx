import React from 'react'
import { GameManifest } from '../data/tier1Roster'

interface GameDetailPanelProps {
  game: GameManifest | null;
}

export const GameDetailPanel: React.FC<GameDetailPanelProps> = ({ game }) => {
  if (!game) {
    return (
      <div className="detail-placeholder">
        Select a game from the roster to view details.
      </div>
    )
  }

  return (
    <div className="game-detail">
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
        <button className="launch-btn" disabled>
          Launch (Not Implemented)
        </button>
      </div>
    </div>
  )
}
