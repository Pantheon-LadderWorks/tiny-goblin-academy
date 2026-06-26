import React from 'react'
import { GameManifest } from '../data/tier1Roster'
import { getIconForGame, hubIconSheetImage } from '../data/hubIcons'
import { StatusBadge } from './StatusBadge'

interface GameCardProps {
  game: GameManifest;
  onClick: () => void;
  isSelected: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onClick, isSelected }) => {
  const cardClass = `game-card ${game.restorationDeferred ? 'deferred' : ''} ${isSelected ? 'selected' : ''}`
  const iconData = getIconForGame(game.id)
  
  const iconStyle = iconData ? {
    '--icon-row': iconData.row,
    '--icon-col': iconData.col,
    '--icon-columns': 5,
    '--icon-rows': 2,
    backgroundImage: `url(${hubIconSheetImage})`
  } as React.CSSProperties : {}
  
  return (
    <div className={cardClass} onClick={onClick} style={isSelected ? { borderColor: 'var(--accent-teal)' } : {}}>
      <div className="game-card-header">
        <div className="game-card-title-group">
          {iconData && <div className="game-icon" style={iconStyle}></div>}
          <h3 className="game-card-title">{game.title}</h3>
        </div>
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
