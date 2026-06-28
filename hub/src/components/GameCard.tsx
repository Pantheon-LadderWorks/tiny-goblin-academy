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
        <div className="status-badges">
          {game.restorationDeferred ? (
            <StatusBadge type="missing" label="Restoration Deferred" />
          ) : (
            <>
              <StatusBadge type="info" label="Listed" />
              {game.sourceDirectoryExists && <StatusBadge type="source" label="Source Available" />}
              {game.workspaceMember && <StatusBadge type="info" label="Workspace Member" />}
              {game.buildStatus && (
                <StatusBadge 
                  type={game.buildStatus === 'built' ? 'build' : (game.buildStatus === 'incomplete' ? 'dev' : 'missing')} 
                  label={`Build: ${game.buildStatus.charAt(0).toUpperCase() + game.buildStatus.slice(1)}`} 
                />
              )}
              {game.hasDevScript && <StatusBadge type="info" label="Dev Script" />}
              {game.distHasIndexHtml && <StatusBadge type="build" label="Static Entry Found" />}
              <StatusBadge type="dev" label="View Runtime Status" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
