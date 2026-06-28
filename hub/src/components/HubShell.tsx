import React, { useState } from 'react'
import { tier1Roster, GameManifest } from '../data/tier1Roster'
import { GameRoster } from './GameRoster'
import { GameDetailPanel } from './GameDetailPanel'
import { CreditsPanel } from './CreditsPanel'

export const HubShell: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameManifest | null>(null)
  const [diagnostic, setDiagnostic] = useState<string | null>(null)

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
        <div className="tauri-diagnostic" style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
          {diagnostic ? (
            <span style={{ backgroundColor: '#2a2a2a', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #444' }}>
              ✓ {diagnostic}
            </span>
          ) : (
            <button 
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'transparent', border: '1px solid #666', color: '#888', cursor: 'pointer', borderRadius: '4px' }}
              onClick={async () => {
                try {
                  const { invoke } = await import('@tauri-apps/api/core');
                  const res = await invoke<string>('get_diagnostic_info');
                  setDiagnostic(res);
                } catch (e) {
                  setDiagnostic('Tauri bridge offline/error');
                }
              }}
            >
              Diagnostic: Ping Tauri Bridge
            </button>
          )}
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
