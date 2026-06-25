import React from 'react'
import { GameManifest } from '../data/tier1Roster'
import { StatusBadge } from './StatusBadge'

interface GameCardProps {
  game: GameManifest;
  onClick: () => void;
  isSelected: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onClick, isSelected }) => {
  const cardClass = `game-card ${game.restorationDeferred ? 'deferred' : ''} ${isSelected ? 'selected' : ''}`
  
  return (
    <div className={cardClass} onClick={onClick} style={isSelected ? { borderColor: 'var(--accent-teal)' } : {}}>
      <div className="game-card-header">
        <h3 className="game-card-title">{game.title}</h3>
        <span className="game-level">Level {game.level}</span>
      </div>
      <div className="status-badges">
        {game.restorationDeferred ? (
          <StatusBadge type="missing" label="Restoration Deferred" />
        ) : (
          <>
            {game.sourceAvailable && <StatusBadge type="source" label="Source Available" />}
            {game.devRunnable && <StatusBadge type="dev" label="Dev Runnable" />}
          </>
        )}
      </div>
    </div>
  )
}
