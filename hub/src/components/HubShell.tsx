import React, { useState, useEffect } from 'react'
import { tier1Roster, GameManifest } from '../data/tier1Roster'
import { GameRoster } from './GameRoster'
import { GameDetailPanel } from './GameDetailPanel'
import { CreditsPanel } from './CreditsPanel'
import { GameStatus, HubRuntimeStatus } from '../types/RuntimeStatus'
import { DevGameRuntimeView, ActiveDevGameRuntime } from './DevGameRuntimeView'
import { GameLaunchBootScreen } from './GameLaunchBootScreen'
import { invoke } from '@tauri-apps/api/core'
import tgaBanner from '../../../assets/academy/hub/banner/tga-hub-banner-source-v0.1.png'
export const HubShell: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameManifest | null>(null)
  const [diagnostic, setDiagnostic] = useState<string | null>(null)
  const [runtimeStatus, setRuntimeStatus] = useState<HubRuntimeStatus | null>(null)
  const [gameStatuses, setGameStatuses] = useState<Record<string, GameStatus>>({})
  const [activeRuntime, setActiveRuntime] = useState<ActiveDevGameRuntime | null>(null)
  const [isStoppingRuntime, setIsStoppingRuntime] = useState(false)
  const [bootingGame, setBootingGame] = useState<GameManifest | null>(null)

  useEffect(() => {
    async function initTauri() {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        const rStatus = await invoke<HubRuntimeStatus>('get_runtime_status');
        setRuntimeStatus(rStatus);
        
        const gStatuses = await invoke<GameStatus[]>('list_game_statuses');
        const statusMap: Record<string, GameStatus> = {};
        for (const status of gStatuses) {
          statusMap[status.gameId] = status;
        }
        setGameStatuses(statusMap);
      } catch (e) {
        console.error("Tauri initialization failed", e);
      }
    }
    initTauri();
  }, [])

  // Merge static roster with dynamic statuses
  const mergedRoster = tier1Roster.map(game => {
    const dynamicStatus = gameStatuses[game.id];
    if (!dynamicStatus) return game;
    return {
      ...game,
      ...dynamicStatus
    }
  });

  const refreshGameStatus = async (gameId: string) => {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const status = await invoke<GameStatus>('get_game_status', { gameId });
      setGameStatuses(prev => ({ ...prev, [gameId]: status }));
    } catch (e) {
      console.error(`Failed to refresh status for ${gameId}`, e);
    }
  };

  const selectedGameMerged = selectedGame ? mergedRoster.find(g => g.id === selectedGame.id) || selectedGame : null;

  const historicalPassCount = tier1Roster.filter(g => g.historicallyPassed).length;
  const sourceAvailableCount = mergedRoster.filter(g => g.sourceAvailable).length;
  const deferredCount = tier1Roster.filter(g => g.restorationDeferred).length;

  const handleCloseRuntime = async () => {
    if (!activeRuntime) return;
    setIsStoppingRuntime(true);
    try {
      await invoke('stop_dev_game', { gameId: activeRuntime.gameId });
    } catch (e) {
      console.error("Failed to stop dev game on close", e);
      alert(`Failed to stop dev server: ${e}`);
    } finally {
      setIsStoppingRuntime(false);
      const gid = activeRuntime.gameId;
      setActiveRuntime(null);
      refreshGameStatus(gid);
    }
  };

  if (bootingGame) {
    return (
      <GameLaunchBootScreen 
        game={bootingGame} 
        onCancel={async () => {
          try {
            await invoke('stop_dev_game', { gameId: bootingGame.id });
          } catch(e) {
            console.error("Failed to stop dev game on boot cancel", e);
          }
          setBootingGame(null);
        }} 
        onReady={(status) => {
          setBootingGame(null);
          setActiveRuntime({ 
            gameId: bootingGame.id, 
            title: bootingGame.title,
            url: status.url || `http://127.0.0.1:${status.port}`,
            port: status.port || 5100,
            pid: status.pid,
            startedAt: status.startedAt
          });
        }} 
      />
    );
  }

  if (activeRuntime) {
    return (
      <DevGameRuntimeView 
        runtime={activeRuntime} 
        onClose={handleCloseRuntime} 
        isStopping={isStoppingRuntime} 
      />
    );
  }

  return (
    <div className="hub-shell">
      <header className="hub-header">
        <div>
          <div className="hub-title-banner-frame">
            <img src={tgaBanner} alt="Tiny Goblin Academy" className="hub-title-banner" />
          </div>
          <div className="hub-tagline">Tier 1 Dashboard Catalog (Read-Only)</div>
          <div className="tier-summary">
            <span>Progress: {historicalPassCount}/10 Passed</span> &bull; <span>{sourceAvailableCount}/10 Source Available</span> &bull; <span>{deferredCount} Deferred</span>
            {runtimeStatus && (
              <span style={{ marginLeft: '1rem', backgroundColor: '#334466', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                Mode: {runtimeStatus.runtimeMode}
              </span>
            )}
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
                  
                  // Also refresh statuses on ping
                  const gStatuses = await invoke<GameStatus[]>('list_game_statuses');
                  const statusMap: Record<string, GameStatus> = {};
                  for (const status of gStatuses) {
                    statusMap[status.gameId] = status;
                  }
                  setGameStatuses(statusMap);
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
          games={mergedRoster} 
          onSelect={setSelectedGame}
          selectedId={selectedGame?.id}
        />
        
        <GameDetailPanel 
          game={selectedGameMerged} 
          onClose={() => setSelectedGame(null)} 
          onGameUpdate={refreshGameStatus}
          onLaunchDevBoot={(game) => {
            invoke('launch_dev_game', { gameId: game.id })
              .catch(e => console.error("Failed to invoke launch_dev_game on boot start", e));
            setBootingGame(game);
          }}
        />
      </main>
    </div>
  )
}
