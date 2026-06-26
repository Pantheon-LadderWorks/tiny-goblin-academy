import React, { useState } from 'react'
import { tier1Roster, GameManifest } from '../data/tier1Roster'
import { GameRoster } from './GameRoster'
import { GameDetailPanel } from './GameDetailPanel'
import { CreditsPanel } from './CreditsPanel'

export const HubShell: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameManifest | null>(null)

  const historicalPassCount = tier1Roster.filter(g => g.historicallyPassed).length;
  const sourceAvailableCount = tier1Roster.filter(g => g.sourceAvailable).length;
  const deferredCount = tier1Roster.filter(g => g.restorationDeferred).length;

  return (
    <div className="hub-shell">
      <header className="hub-header">
        <div>
          <h1 className="hub-title">Tiny Goblin Academy</h1>
          <div className="hub-tagline">Tier 1 Dashboard Catalog (Read-Only)</div>
          <div className="tier-summary">
            <span>Progress: {historicalPassCount}/10 Passed</span> &bull; <span>{sourceAvailableCount}/10 Source Available</span> &bull; <span>{deferredCount} Deferred</span>
          </div>
        </div>
        <CreditsPanel />
      </header>
      
      <main className="hub-main">
        <GameRoster 
          games={tier1Roster} 
          onSelect={setSelectedGame}
          selectedId={selectedGame?.id}
        />
        
        <GameDetailPanel 
          game={selectedGame} 
          onClose={() => setSelectedGame(null)} 
        />
      </main>
    </div>
  )
}
