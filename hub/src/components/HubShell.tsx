import React, { useState } from 'react'
import { tier1Roster, GameManifest } from '../data/tier1Roster'
import { GameRoster } from './GameRoster'
import { GameDetailPanel } from './GameDetailPanel'
import { CreditsPanel } from './CreditsPanel'

export const HubShell: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameManifest | null>(null)

  return (
    <div className="hub-shell">
      <header className="hub-header">
        <div>
          <h1 className="hub-title">Tiny Goblin Academy</h1>
          <div className="hub-tagline">10 tiny games. One serious AI-assisted learning ladder.</div>
        </div>
        <CreditsPanel />
      </header>
      
      <main className="hub-main">
        <section className="roster-panel">
          <GameRoster 
            games={tier1Roster} 
            onSelect={setSelectedGame}
            selectedId={selectedGame?.id}
          />
        </section>
        
        <section className="detail-panel">
          <GameDetailPanel game={selectedGame} />
        </section>
      </main>
    </div>
  )
}
