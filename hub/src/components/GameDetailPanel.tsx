import React, { useEffect, useState } from 'react'
import { GameManifest } from '../data/tier1Roster'
import { hubIconRegions } from '../data/hubIconRegions'
import { SpriteFrame } from './SpriteFrame'
import { invoke } from '@tauri-apps/api/core'
import { InstallDevDependenciesResult, UninstallDevDependenciesResult, DevGameProcessStatus, LaunchDevGameResult, StopDevGameResult } from '../types/RuntimeStatus'
import { ActiveDevGameRuntime } from './DevGameRuntimeView'

interface GameDetailPanelProps {
  game: GameManifest | null;
  onClose: () => void;
  onGameUpdate?: (gameId: string) => void;
  onLaunchSuccess?: (runtime: ActiveDevGameRuntime) => void;
}

export const GameDetailPanel: React.FC<GameDetailPanelProps> = ({ game, onClose, onGameUpdate, onLaunchSuccess }) => {
  const [installing, setInstalling] = useState(false);
  const [installResult, setInstallResult] = useState<InstallDevDependenciesResult | null>(null);
  
  const [uninstalling, setUninstalling] = useState(false);
  const [uninstallResult, setUninstallResult] = useState<UninstallDevDependenciesResult | null>(null);

  const [launching, setLaunching] = useState(false);
  const [launchResult, setLaunchResult] = useState<LaunchDevGameResult | null>(null);
  
  const [stopping, setStopping] = useState(false);
  const [stopResult, setStopResult] = useState<StopDevGameResult | null>(null);

  const [processStatus, setProcessStatus] = useState<DevGameProcessStatus | null>(null);

  const refreshProcessStatus = async () => {
    if (!game) return;
    try {
      const processes = await invoke<DevGameProcessStatus[]>('list_dev_game_processes');
      const mine = processes.find(p => p.gameId === game.id);
      setProcessStatus(mine || null);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshProcessStatus();
    const interval = setInterval(refreshProcessStatus, 2000);
    return () => clearInterval(interval);
  }, [game?.id]);

  const [pendingAutoJump, setPendingAutoJump] = useState(false);

  useEffect(() => {
    if (pendingAutoJump && processStatus?.status === 'running' && onLaunchSuccess && game) {
      setPendingAutoJump(false);
      setLaunching(false);
      onLaunchSuccess({
        gameId: game.id,
        title: game.title,
        url: processStatus.url || `http://127.0.0.1:${processStatus.port}`,
        port: processStatus.port || 5100,
        pid: processStatus.pid,
        startedAt: processStatus.startedAt,
      });
    }
    if (pendingAutoJump && processStatus?.status === 'failed') {
      setPendingAutoJump(false);
      setLaunching(false);
    }
  }, [processStatus, pendingAutoJump, onLaunchSuccess, game]);

  const handleLaunchDevGame = async () => {
    if (!game) return;
    const confirmed = window.confirm(`Are you sure you want to launch the dev server for ${game.title}?`);
    if (!confirmed) return;

    setLaunching(true);
    setLaunchResult(null);
    setStopResult(null);
    setPendingAutoJump(true);
    
    try {
      const result = await invoke<LaunchDevGameResult>('launch_dev_game', { gameId: game.id });
      setLaunchResult(result);
      if (onGameUpdate) onGameUpdate(game.id);
      refreshProcessStatus();
    } catch (e) {
      console.error(e);
      setPendingAutoJump(false);
      setLaunchResult({
        gameId: game.id,
        ok: false,
        launchAttempted: false,
        commandLabel: 'Unknown',
        pid: null,
        url: null,
        port: null,
        startedAt: null,
        stdoutTail: '',
        stderrTail: '',
        blockedReason: String(e),
        errorState: String(e)
      });
      setLaunching(false);
    }
  };

  const handleStopDevGame = async () => {
    if (!game) return;
    const confirmed = window.confirm(`Are you sure you want to stop the dev server for ${game.title}?`);
    if (!confirmed) return;

    setStopping(true);
    setStopResult(null);
    try {
      const result = await invoke<StopDevGameResult>('stop_dev_game', { gameId: game.id });
      setStopResult(result);
      if (onGameUpdate) onGameUpdate(game.id);
      refreshProcessStatus();
    } catch (e) {
      console.error(e);
      setStopResult({
        gameId: game.id,
        ok: false,
        stopAttempted: false,
        pid: null,
        stoppedAt: null,
        blockedReason: String(e),
        errorState: String(e)
      });
    } finally {
      setStopping(false);
    }
  };

  const handleInstallDeps = async () => {
    if (!game) return;
    const confirmed = window.confirm(`Are you sure you want to install dev dependencies for ${game.title}?`);
    if (!confirmed) return;

    setInstalling(true);
    setInstallResult(null);
    try {
      const result = await invoke<InstallDevDependenciesResult>('install_dev_dependencies', { gameId: game.id });
      setInstallResult(result);
      if (onGameUpdate) onGameUpdate(game.id);
    } catch (e) {
      console.error(e);
      setInstallResult({
        gameId: game.id,
        ok: false,
        commandLabel: 'Unknown',
        startedAt: '',
        finishedAt: '',
        exitCode: null,
        stdoutTail: '',
        stderrTail: String(e),
        dependenciesInstalledAfter: false,
        errorState: String(e)
      });
    } finally {
      setInstalling(false);
    }
  };

  const handleUninstallDeps = async () => {
    if (!game) return;
    const confirmed = window.confirm(`Are you sure you want to completely remove dev dependencies for ${game.title}?`);
    if (!confirmed) return;

    setUninstalling(true);
    setUninstallResult(null);
    try {
      const result = await invoke<UninstallDevDependenciesResult>('uninstall_dev_dependencies', { gameId: game.id });
      setUninstallResult(result);
      if (onGameUpdate) onGameUpdate(game.id);
    } catch (e) {
      console.error(e);
      setUninstallResult({
        gameId: game.id,
        ok: false,
        uninstallAttempted: false,
        startedAt: '',
        finishedAt: '',
        targetLabel: 'Unknown',
        dependencyPathWasPresent: false,
        dependencyPathRemoved: false,
        dependenciesInstalledAfter: game.dependenciesInstalled ?? false,
        blockedReason: String(e),
        errorState: String(e)
      });
    } finally {
      setUninstalling(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!game) {
    return null;
  }

  const iconRegion = hubIconRegions.find(r => r.gameId === game.id)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
        {iconRegion && (
          <div className="modal-icon-container">
            <SpriteFrame 
              sourceRect={iconRegion.sourceRect} 
              alt={iconRegion.label}
              className="modal-game-icon"
            />
          </div>
        )}
        <h2 className="detail-title">{game.title}</h2>
      
      <div className="detail-section">
        <h4>Level {game.level} • Tier {game.tier}</h4>
        <p>{game.shortDescription}</p>
      </div>
      
      <div className="detail-section">
        <h4>Core Lesson</h4>
        <p>{game.coreLesson}</p>
      </div>

      <div className="detail-section">
        <h4>Controls</h4>
        <p>{game.controls}</p>
      </div>

      <div className="detail-section">
        <h4>Status: {game.displayStatus}</h4>
        <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
          <li><strong>Listed:</strong> {game.listed ? 'Yes' : 'No'}</li>
          <li><strong>Workspace Member:</strong> {game.workspaceMember ? 'Yes' : 'No'}</li>
          <li><strong>Source Directory:</strong> {game.sourceDirectoryExists ? 'Found' : 'Missing'}</li>
          <li><strong>Package.json:</strong> {game.packageJsonExists ? 'Found' : 'Missing'}</li>
          <li><strong>Node Modules:</strong> {game.nodeModulesExists ? 'Installed' : 'Missing'}</li>
          <li><strong>Dev Script:</strong> {game.hasDevScript ? 'Yes' : 'No'}</li>
          <li><strong>Build Script:</strong> {game.hasBuildScript ? 'Yes' : 'No'}</li>
          <li><strong>Dist Exists:</strong> {game.distExists ? 'Yes' : 'No'}</li>
          <li><strong>Static Entry (index.html):</strong> {game.distHasIndexHtml ? 'Found' : 'Missing'}</li>
          <li><strong>Dist Asset Count:</strong> {game.distAssetCount ?? 0}</li>
          <li><strong>Build Status:</strong> {game.buildStatus}</li>
          <li><strong>Playable Available:</strong> {game.playableAvailable ? 'Yes' : 'No'}</li>
          <li><strong>Playable Mode:</strong> {game.playableMode}</li>
          <li><strong>Production Installed:</strong> {game.installed ? 'Yes' : 'No'} (Future)</li>
        </ul>
      </div>

      {game.sourcePath && (
        <div className="detail-section">
          <h4>Source Path</h4>
          <p><code className="source-path">{game.sourcePath}</code></p>
        </div>
      )}

      {game.restorationDeferred && (
        <div className="deferred-note">
          <strong>Restoration Deferred:</strong> Source restoration deferred until Hub/package model is ready.
        </div>
      )}

      {!game.restorationDeferred && (
        <div className="detail-section">
          <h4>Notes</h4>
          <p>{game.notes}</p>
        </div>
      )}
      
      <div className="action-bar dev-actions">
        <h4>Developer Actions</h4>
        {game.sourceDirectoryExists ? (
          <div className="dev-button-group" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <button className="btn" disabled={!game.devInstallDepsAvailable || installing} onClick={handleInstallDeps}>
              {installing ? "Installing..." : (game.devInstallDepsAvailable ? "Install Dev Deps" : "Deps Installed")}
            </button>
            <button className="btn" disabled={!game.devUninstallDepsAvailable || uninstalling} onClick={handleUninstallDeps}>
              {uninstalling ? "Uninstalling..." : "Uninstall Dev Deps"}
            </button>
            {processStatus?.running ? (
              <>
                <button className="btn stop-btn" disabled={stopping} onClick={handleStopDevGame}>
                  {stopping ? "Stopping..." : "Stop Dev Server"}
                </button>
                <button className="btn launch-btn" onClick={() => {
                  if (onLaunchSuccess) {
                    onLaunchSuccess({
                      gameId: game.id,
                      title: game.title,
                      url: processStatus.url || `http://127.0.0.1:${processStatus.port}`,
                      port: processStatus.port || 5100,
                      pid: processStatus.pid,
                      startedAt: processStatus.startedAt,
                    });
                  }
                }}>
                  Jump to Game
                </button>
              </>
            ) : (
              <button className="btn launch-btn" disabled={!game.devLaunchAvailable || launching || processStatus?.status === 'launching'} onClick={handleLaunchDevGame}>
                {launching || processStatus?.status === 'launching' ? "Launching..." : (game.devLaunchAvailable ? "Launch Dev Game" : "Launch Blocked")}
              </button>
            )}
            {!game.devLaunchAvailable && game.devLaunchBlockedReason && !processStatus?.running && (
              <p className="launch-warning" style={{ width: '100%', margin: '0.5rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Reason: {game.devLaunchBlockedReason}
              </p>
            )}

            {processStatus?.running && (
              <div className="process-status" style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#1e3a1e', borderRadius: '4px', border: '1px solid #4caf50' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#81c784' }}>Dev Server Running</h5>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem' }}>URL: <a href={processStatus.url || '#'} target="_blank" rel="noreferrer" style={{ color: '#81c784' }}>{processStatus.url}</a></p>
                <p style={{ margin: '0', fontSize: '0.85rem', color: '#aaa' }}>PID: {processStatus.pid} | Port: {processStatus.port}</p>
              </div>
            )}

            {launchResult && !launchResult.ok && (
              <div className="launch-result" style={{ width: '100%', marginTop: '1rem', padding: '1rem', backgroundColor: '#1e1e1e', borderRadius: '4px', border: '1px solid #c62828' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#f44336' }}>Launch Failed</h5>
                {launchResult.blockedReason && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#ffb3b3' }}>Reason: {launchResult.blockedReason}</p>}
                {launchResult.errorState && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#ff8a80' }}>Error: {launchResult.errorState}</p>}
              </div>
            )}

            {stopResult && !stopResult.ok && (
              <div className="stop-result" style={{ width: '100%', marginTop: '1rem', padding: '1rem', backgroundColor: '#1e1e1e', borderRadius: '4px', border: '1px solid #c62828' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#f44336' }}>Stop Failed</h5>
                {stopResult.blockedReason && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#ffb3b3' }}>Reason: {stopResult.blockedReason}</p>}
                {stopResult.errorState && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#ff8a80' }}>Error: {stopResult.errorState}</p>}
              </div>
            )}
            
            {installResult && (
              <div className="install-result" style={{ width: '100%', marginTop: '1rem', padding: '1rem', backgroundColor: '#1e1e1e', borderRadius: '4px', border: installResult.ok ? '1px solid #2e7d32' : '1px solid #c62828' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', color: installResult.ok ? '#4caf50' : '#f44336' }}>
                  {installResult.ok ? "Install Successful" : "Install Failed"}
                </h5>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#aaa' }}>
                  Command: <code>{installResult.commandLabel}</code>
                </p>
                {installResult.errorState && (
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#ff8a80' }}>
                    Error: {installResult.errorState}
                  </p>
                )}
                {installResult.stdoutTail && (
                  <pre style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', overflowX: 'auto', backgroundColor: '#000', padding: '0.5rem', borderRadius: '4px', maxHeight: '150px' }}>
                    {installResult.stdoutTail}
                  </pre>
                )}
                {installResult.stderrTail && (
                  <pre style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', overflowX: 'auto', backgroundColor: '#2b0000', color: '#ffb3b3', padding: '0.5rem', borderRadius: '4px', maxHeight: '150px' }}>
                    {installResult.stderrTail}
                  </pre>
                )}
              </div>
            )}
            
            {uninstallResult && (
              <div className="uninstall-result" style={{ width: '100%', marginTop: '1rem', padding: '1rem', backgroundColor: '#1e1e1e', borderRadius: '4px', border: uninstallResult.ok ? '1px solid #2e7d32' : '1px solid #c62828' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', color: uninstallResult.ok ? '#4caf50' : '#f44336' }}>
                  {uninstallResult.ok ? "Uninstall Successful" : "Uninstall Failed/Blocked"}
                </h5>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#aaa' }}>
                  Target: <code>{uninstallResult.targetLabel}</code>
                </p>
                {uninstallResult.blockedReason && (
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#ffb3b3' }}>
                    Reason: {uninstallResult.blockedReason}
                  </p>
                )}
                {uninstallResult.errorState && (
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#ff8a80' }}>
                    Error: {uninstallResult.errorState}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="launch-warning" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Source missing. Dev actions unavailable.
          </p>
        )}
      </div>

      <div className="action-bar prod-actions" style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <h4>Production Actions</h4>
        <div className="dev-button-group" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <button className="btn" disabled>Install (Future)</button>
          <button className="btn" disabled>Update (Future)</button>
          <button className="btn launch-btn" disabled>Launch (Future)</button>
        </div>
        {game.productionActionBlockedReason && (
          <p className="launch-warning" style={{ width: '100%', margin: '0.5rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {game.productionActionBlockedReason}
          </p>
        )}
      </div>
      </div>
    </div>
  )
}
