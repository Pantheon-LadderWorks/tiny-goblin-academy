import React from 'react'
import { GameManifest } from '../data/tier1Roster'
import { GameCard } from './GameCard'

interface GameRosterProps {
  games: GameManifest[];
  onSelect: (game: GameManifest) => void;
  selectedId?: string;
}

export const GameRoster: React.FC<GameRosterProps> = ({ games, onSelect, selectedId }) => {
  return (
    <div className="game-roster">
      {games.map(game => (
        <GameCard 
          key={game.id} 
          game={game} 
          onClick={() => onSelect(game)}
          isSelected={game.id === selectedId}
        />
      ))}
    </div>
  )
}
