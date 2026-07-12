import React, { useEffect, useMemo, useState } from 'react';

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

type RuntimeOverlay = 'ledger' | 'help' | 'dev' | null;

interface AcademyRuntimeShellContract {
  version: 'H6.1';
  persistentShell: 'minimal-top-bar';
  ledgerShortcut: 'L';
  overlaySurfaces: Array<Exclude<RuntimeOverlay, null>>;
  runtimeBoundary: 'shell-contract-only';
}

const runtimeShellContract: AcademyRuntimeShellContract = {
  version: 'H6.1',
  persistentShell: 'minimal-top-bar',
  ledgerShortcut: 'L',
  overlaySurfaces: ['ledger', 'help', 'dev'],
  runtimeBoundary: 'shell-contract-only',
};

export const DevGameRuntimeView: React.FC<DevGameRuntimeViewProps> = ({ runtime, onClose, isStopping }) => {
  const [activeOverlay, setActiveOverlay] = useState<RuntimeOverlay>(null);

  const closeOverlay = () => setActiveOverlay(null);
  const toggleOverlay = (overlay: Exclude<RuntimeOverlay, null>) => {
    setActiveOverlay((current) => (current === overlay ? null : overlay));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key.toLowerCase() === runtimeShellContract.ledgerShortcut.toLowerCase()) {
        const target = event.target as HTMLElement | null;
        const tagName = target?.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || target?.isContentEditable) return;
        event.preventDefault();
        toggleOverlay('ledger');
      }
      if (event.key === 'Escape') {
        closeOverlay();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const overlayTitle = useMemo(() => {
    if (activeOverlay === 'ledger') return 'Action Ledger';
    if (activeOverlay === 'help') return 'Help / Controls';
    if (activeOverlay === 'dev') return 'Dev Overlay';
    return '';
  }, [activeOverlay]);

  return (
    <div className="dev-game-runtime-view">
      <header className="runtime-header" aria-label="Academy runtime shell">
        <div className="runtime-title-cluster">
          <span className="runtime-academy-title">Tiny Goblin Academy</span>
          <span className="runtime-title-separator">/</span>
          <span className="runtime-game-title">{runtime.title}</span>
          <span className="runtime-dev-pill">Dev Mode</span>
          <span className="runtime-url">{runtime.url}</span>
        </div>

        <div className="runtime-action-cluster">
          <button
            className="runtime-shell-btn"
            type="button"
            onClick={() => toggleOverlay('ledger')}
            aria-pressed={activeOverlay === 'ledger'}
            title="Open the action ledger (L)"
          >
            Ledger <span className="runtime-shortcut">L</span>
          </button>
          <button
            className="runtime-shell-btn"
            type="button"
            onClick={() => toggleOverlay('help')}
            aria-pressed={activeOverlay === 'help'}
          >
            Help
          </button>
          <button
            className="runtime-shell-btn runtime-shell-btn-dev"
            type="button"
            onClick={() => toggleOverlay('dev')}
            aria-pressed={activeOverlay === 'dev'}
          >
            Dev
          </button>
          <button
          className="btn stop-btn"
          onClick={onClose}
          disabled={isStopping}
        >
          {isStopping ? "Stopping Server..." : "Close Game / Return to Academy"}
        </button>
        </div>
      </header>

      <main className="runtime-content">
        <iframe
          src={runtime.url}
          title={`Dev Game Runtime: ${runtime.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />

        {activeOverlay && (
          <div className="runtime-overlay-backdrop" role="presentation" onMouseDown={closeOverlay}>
            <section
              className="runtime-overlay-panel"
              role="dialog"
              aria-modal="true"
              aria-label={overlayTitle}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="runtime-overlay-header">
                <div>
                  <p className="runtime-overlay-kicker">Academy Shell · {runtimeShellContract.version}</p>
                  <h2>{overlayTitle}</h2>
                </div>
                <button className="runtime-overlay-close" type="button" onClick={closeOverlay} aria-label="Close overlay">
                  ×
                </button>
              </div>

              {activeOverlay === 'ledger' && (
                <div className="runtime-overlay-body">
                  <p>
                    The shared shell now owns the Ledger surface. This H6.1 contract proves the top-bar button and <kbd>L</kbd>
                    shortcut without migrating per-game ledgers yet.
                  </p>
                  <div className="runtime-contract-card">
                    <strong>Current boundary:</strong> games may still render their internal ledgers until their H6 migration lane.
                  </div>
                </div>
              )}

              {activeOverlay === 'help' && (
                <div className="runtime-overlay-body">
                  <p>
                    Help is the future home for objectives, controls, and rules that used to sit in permanent side panels.
                  </p>
                  <ul>
                    <li>Keyboard and touch controls should be listed here.</li>
                    <li>Player-facing controls move into the game stage when needed.</li>
                    <li>Dev/test controls move to the Dev overlay.</li>
                  </ul>
                </div>
              )}

              {activeOverlay === 'dev' && (
                <div className="runtime-overlay-body">
                  <p>
                    Dev state stays available, but hidden by default. Position, velocity, grounded flags, and manifest IDs belong
                    here instead of permanent player-facing rails.
                  </p>
                  <dl className="runtime-dev-list">
                    <div>
                      <dt>Game</dt>
                      <dd>{runtime.gameId}</dd>
                    </div>
                    <div>
                      <dt>Port</dt>
                      <dd>{runtime.port}</dd>
                    </div>
                    <div>
                      <dt>PID</dt>
                      <dd>{runtime.pid ?? 'untracked'}</dd>
                    </div>
                    <div>
                      <dt>Started</dt>
                      <dd>{runtime.startedAt ?? 'unknown'}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};
