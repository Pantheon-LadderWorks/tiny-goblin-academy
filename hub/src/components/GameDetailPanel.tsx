import React, { useEffect, useState } from 'react'
import { GameManifest } from '../data/tier1Roster'
import { hubIconRegions } from '../data/hubIconRegions'
import { SpriteFrame } from './SpriteFrame'
import { invoke } from '@tauri-apps/api/core'
import { InstallDevDependenciesResult, UninstallDevDependenciesResult } from '../types/RuntimeStatus'

interface GameDetailPanelProps {
  game: GameManifest | null;
  onClose: () => void;
  onGameUpdate?: (gameId: string) => void;
}

export const GameDetailPanel: React.FC<GameDetailPanelProps> = ({ game, onClose, onGameUpdate }) => {
  const [installing, setInstalling] = useState(false);
  const [installResult, setInstallResult] = useState<InstallDevDependenciesResult | null>(null);
  
  const [uninstalling, setUninstalling] = useState(false);
  const [uninstallResult, setUninstallResult] = useState<UninstallDevDependenciesResult | null>(null);

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
            <button className="btn launch-btn" disabled={!game.devLaunchAvailable}>
              {game.devLaunchAvailable ? "Launch Dev Server (Coming H3.7)" : `Launch Blocked`}
            </button>
            {!game.devLaunchAvailable && game.devLaunchBlockedReason && (
              <p className="launch-warning" style={{ width: '100%', margin: '0.5rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Reason: {game.devLaunchBlockedReason}
              </p>
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
