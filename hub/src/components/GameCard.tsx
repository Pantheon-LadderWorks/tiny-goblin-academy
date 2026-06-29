import React from 'react'
import { GameManifest } from '../data/tier1Roster'
import { hubIconRegions } from '../data/hubIconRegions'
import { StatusBadge } from './StatusBadge'
import { SpriteFrame } from './SpriteFrame'

interface GameCardProps {
  game: GameManifest;
  onClick: () => void;
  isSelected: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onClick, isSelected }) => {
  const cardClass = `game-card ${game.restorationDeferred ? 'deferred' : ''} ${isSelected ? 'selected' : ''}`

  const iconRegion = hubIconRegions.find(r => r.gameId === game.id)

  // Single compact readiness signal on card face.
  // All verbose metadata (Listed, Workspace Member, Build, Dev Script, etc.)
  // lives in the GameDetailPanel modal — not here.
  let readinessType: 'missing' | 'source' | 'build' | 'dev' | 'info' = 'info'
  let readinessLabel = 'Needs Setup'
  if (game.restorationDeferred) {
    readinessType = 'missing'
    readinessLabel = 'Restoration Deferred'
  } else if (game.devLaunchAvailable || game.playableMode === 'dev') {
    readinessType = 'dev'
    readinessLabel = 'Dev Ready'
  } else if (game.sourceDirectoryExists || game.sourceAvailable) {
    readinessType = 'source'
    readinessLabel = 'Source Ready'
  }

  return (
    <div className={cardClass} onClick={onClick}>
      <div className="game-card-frame" title={game.title}>
        {iconRegion && (
          <SpriteFrame
            sourceRect={iconRegion.sourceRect}
            alt={iconRegion.label}
            className="game-icon"
          />
        )}
      </div>
      <div className="game-card-meta">
        <span className="game-level">Level {game.level}</span>
        <StatusBadge type={readinessType} label={readinessLabel} />
      </div>
    </div>
  )
}
