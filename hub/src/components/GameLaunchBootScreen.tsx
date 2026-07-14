import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { GameManifest } from '../data/tier1Roster';
import type { DevGameProcessStatus } from '../types/RuntimeStatus';

interface Props {
  game: GameManifest;
  onCancel: () => void;
  onReady: (status: DevGameProcessStatus) => void;
}

export function GameLaunchBootScreen({ game, onCancel, onReady }: Props) {
  const [status, setStatus] = useState<DevGameProcessStatus | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const poll = async () => {
      try {
        const statuses = await invoke<DevGameProcessStatus[]>('list_dev_game_processes');
        const current = statuses.find(s => s.gameId === game.id);
        if (current) {
          setStatus(current);

          // If running and URL exists, we are ready!
          if (current.status === 'running' && current.url) {
            onReady(current);
          }
        }
      } catch (err) {
        console.error("Failed to poll dev processes during boot:", err);
      }
    };

    poll();
    interval = setInterval(poll, 1000);
    return () => clearInterval(interval);
  }, [game.id, onReady]);

  const getStage = () => {
    if (!status) return 'Preparing runtime...';
    if (status.status === 'failed') return 'Failed to start dev server.';
    if (status.status === 'running') return 'Dev server ready. Loading game...';
    if (status.running && !status.url) return 'Waiting for local server to become ready...';
    return 'Starting dev server...';
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      backgroundColor: '#1a1820', color: '#ffebcd',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      padding: '2rem'
    }}>
      <h1 data-typography-role="academy-title" style={{ marginBottom: '0.5rem' }}>Tiny Goblin Academy</h1>
      <h2 data-typography-role="game-title" style={{ color: '#e0c090', marginBottom: '1rem' }}>
        {game.title} <span style={{ fontSize: '1rem', color: '#888' }}>- Level {game.level}</span>
      </h2>
      
      <span data-typography-role="compact-label" style={{
        backgroundColor: '#4a3a60', color: '#fff',
        padding: '0.25rem 0.75rem', borderRadius: '12px',
        fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '2rem'
      }}>
        DEV MODE
      </span>

      <div style={{
        width: '100%', maxWidth: '600px',
        backgroundColor: '#262230', padding: '2rem',
        borderRadius: '8px', border: '1px solid #3c334d'
      }}>
        <h3 data-typography-role="panel-heading" style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid #3c334d', paddingBottom: '0.5rem', color: '#e0c090' }}>
          Launch Status
        </h3>
        
        <p data-typography-role="body-instruction" style={{ marginBottom: '1rem', color: status?.status === 'failed' ? '#ff8a80' : '#4db6ac' }}>
          {getStage()}
        </p>

        {status && status.status === 'failed' && (
          <div style={{ marginTop: '1rem' }}>
            <p style={{ color: '#ff8a80', fontWeight: 'bold', marginBottom: '0.5rem' }}>Fatal Error: {status.errorState}</p>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Logs written to: <code>hub/src-tauri/.dev-runtime-logs/</code>
            </p>
            
            {(status.stdoutTail || status.stderrTail) && (
              <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                {status.stdoutTail && (
                  <>
                    <strong style={{ color: '#aaa' }}>Stdout Tail:</strong>
                    <pre style={{ margin: '0.25rem 0 1rem 0', padding: '0.5rem', backgroundColor: '#111', borderRadius: '4px', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                      {status.stdoutTail}
                    </pre>
                  </>
                )}
                {status.stderrTail && (
                  <>
                    <strong style={{ color: '#ff8a80' }}>Stderr Tail:</strong>
                    <pre style={{ margin: '0.25rem 0 0 0', padding: '0.5rem', backgroundColor: '#311', borderRadius: '4px', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                      {status.stderrTail}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#ff8a80',
              border: '1px solid #ff8a80',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {status?.status === 'failed' ? 'Return to Academy' : 'Cancel Launch'}
          </button>
        </div>
      </div>
    </div>
  );
}
