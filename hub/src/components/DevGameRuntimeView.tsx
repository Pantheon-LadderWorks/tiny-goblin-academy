import React, { useEffect, useMemo, useState } from 'react';
import { getRuntimeHelpContent } from '../data/runtimeHelp';

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
  const helpContent = useMemo(() => getRuntimeHelpContent(runtime.gameId), [runtime.gameId]);

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
          <span className="runtime-academy-title" data-typography-role="compact-label">Tiny Goblin Academy</span>
          <span className="runtime-title-separator">/</span>
          <span className="runtime-game-title" data-typography-role="game-title">{runtime.title}</span>
          <span className="runtime-dev-pill" data-typography-role="compact-label">Dev Mode</span>
          <span className="runtime-url" data-typography-role="debug-information">{runtime.url}</span>
        </div>

        <div className="runtime-action-cluster">
          <button
            className="runtime-shell-btn"
            data-typography-role="compact-label"
            type="button"
            onClick={() => toggleOverlay('ledger')}
            aria-pressed={activeOverlay === 'ledger'}
            title="Open the action ledger (L)"
          >
            Ledger <span className="runtime-shortcut">L</span>
          </button>
          <button
            className="runtime-shell-btn"
            data-typography-role="compact-label"
            type="button"
            onClick={() => toggleOverlay('help')}
            aria-pressed={activeOverlay === 'help'}
          >
            Help
          </button>
          <button
            className="runtime-shell-btn runtime-shell-btn-dev"
            data-typography-role="compact-label"
            type="button"
            onClick={() => toggleOverlay('dev')}
            aria-pressed={activeOverlay === 'dev'}
          >
            Dev
          </button>
          <button
          className="btn stop-btn"
          data-typography-role="compact-label"
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
                  <p className="runtime-overlay-kicker" data-typography-role="compact-label">Academy Shell · {runtimeShellContract.version}</p>
                  <h2 data-typography-role="panel-heading">{overlayTitle}</h2>
                </div>
                <button className="runtime-overlay-close" type="button" onClick={closeOverlay} aria-label="Close overlay">
                  ×
                </button>
              </div>

              {activeOverlay === 'ledger' && (
                <div className="runtime-overlay-body" data-typography-role="body-instruction">
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
                <div className="runtime-overlay-body" data-typography-role="body-instruction">
                  <p><strong>Objective:</strong> {helpContent.objective}</p>
                  <p><strong>Controls:</strong> {helpContent.controls}</p>
                  <ul>{helpContent.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
                  {helpContent.hint && <div className="runtime-contract-card">{helpContent.hint}</div>}
                </div>
              )}

              {activeOverlay === 'dev' && (
                <div className="runtime-overlay-body" data-typography-role="body-instruction">
                  <p>
                    Dev state stays available, but hidden by default. Position, velocity, grounded flags, and manifest IDs belong
                    here instead of permanent player-facing rails.
                  </p>
                  <dl className="runtime-dev-list">
                    <div>
                      <dt data-typography-role="compact-label">Game</dt>
                      <dd data-typography-role="debug-information">{runtime.gameId}</dd>
                    </div>
                    <div>
                      <dt data-typography-role="compact-label">Port</dt>
                      <dd data-typography-role="debug-information">{runtime.port}</dd>
                    </div>
                    <div>
                      <dt data-typography-role="compact-label">PID</dt>
                      <dd data-typography-role="debug-information">{runtime.pid ?? 'untracked'}</dd>
                    </div>
                    <div>
                      <dt data-typography-role="compact-label">Started</dt>
                      <dd data-typography-role="debug-information">{runtime.startedAt ?? 'unknown'}</dd>
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
