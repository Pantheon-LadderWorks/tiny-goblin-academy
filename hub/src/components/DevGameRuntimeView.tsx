import React from 'react';

export interface ActiveDevGameRuntime {
  gameId: string;
  title: string;
  url: string;
  port: number;
  pid: number | null;
  startedAt: string | null;
}

interface DevGameRuntimeViewProps {
  runtime: ActiveDevGameRuntime;
  onClose: () => void;
  isStopping: boolean;
}

export const DevGameRuntimeView: React.FC<DevGameRuntimeViewProps> = ({ runtime, onClose, isStopping }) => {
  return (
    <div className="dev-game-runtime-view" style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', backgroundColor: '#0a0a0c' }}>
      <header className="runtime-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.5rem', backgroundColor: '#1a1a24', borderBottom: '1px solid #333' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#e0e0e0' }}>Tiny Goblin Academy</h2>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>/</span>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>{runtime.title}</h3>
          <span style={{ marginLeft: '1rem', padding: '0.2rem 0.5rem', backgroundColor: '#1e3a1e', border: '1px solid #4caf50', borderRadius: '4px', fontSize: '0.8rem', color: '#81c784' }}>
            Dev Mode
          </span>
          <span style={{ fontSize: '0.85rem', color: '#aaa', marginLeft: '0.5rem' }}>
            {runtime.url}
          </span>
        </div>
        <button 
          className="btn stop-btn" 
          onClick={onClose} 
          disabled={isStopping}
          style={{ backgroundColor: '#c62828', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: isStopping ? 'wait' : 'pointer' }}
        >
          {isStopping ? "Stopping Server..." : "Close Game / Return to Academy"}
        </button>
      </header>
      
      <main className="runtime-content" style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        <iframe 
          src={runtime.url} 
          title={`Dev Game Runtime: ${runtime.title}`}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </main>
    </div>
  );
};
