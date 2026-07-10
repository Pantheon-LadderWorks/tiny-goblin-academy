(function () {
  const DEFAULT_REGISTRY_PATH = '../registry/glyphforge-visual-registry.v0.1.json';
  const knownModes = [
    'dashboard-launcher',
    'flipbook-viewer',
    'region-asset-browser',
    'scene-composition-editor',
    'particle-fx-viewer',
    'audio-viewer-placeholder'
  ];

  const state = {
    registry: null,
    entries: [],
    filtered: [],
    selected: null,
    activeMode: 'dashboard-launcher'
  };

  const els = {
    loadDefaultBtn: document.getElementById('loadDefaultBtn'),
    registryFileInput: document.getElementById('registryFileInput'),
    searchInput: document.getElementById('searchInput'),
    domainFilter: document.getElementById('domainFilter'),
    toolModeFilter: document.getElementById('toolModeFilter'),
    reviewFilter: document.getElementById('reviewFilter'),
    runtimeFilter: document.getElementById('runtimeFilter'),
    assetList: document.getElementById('assetList'),
    entryCount: document.getElementById('entryCount'),
    boundaryStrip: document.getElementById('boundaryStrip'),
    viewerTitle: document.getElementById('viewerTitle'),
    viewerContent: document.getElementById('viewerContent'),
    metadataList: document.getElementById('metadataList'),
    warningsPanel: document.getElementById('warningsPanel'),
    pathsPanel: document.getElementById('pathsPanel'),
    rawJsonPreview: document.getElementById('rawJsonPreview')
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
  }

  function setSelectOptions(select, label, values) {
    select.innerHTML = `<option value="">${escapeHtml(label)}</option>`;
    for (const value of values) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    }
  }

  function countBy(entries, key) {
    return entries.reduce((acc, entry) => {
      const value = entry[key] || 'unknown';
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  function countsHtml(title, counts) {
    const rows = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => `<div class="summary-tile"><span class="summary-value">${value}</span>${escapeHtml(key)}</div>`)
      .join('');
    return `<h3>${escapeHtml(title)}</h3><div class="summary-grid">${rows || '<p>No data.</p>'}</div>`;
  }

  function normalizeRegistry(json) {
    const entries = Array.isArray(json.entries) ? json.entries : [];
    for (const entry of entries) {
      entry.warnings = Array.isArray(entry.warnings) ? entry.warnings : [];
      entry.evidencePaths = Array.isArray(entry.evidencePaths) ? entry.evidencePaths : [];
      entry.deniedRegions = Array.isArray(entry.deniedRegions) ? entry.deniedRegions : [];
      entry.deferredRegions = Array.isArray(entry.deferredRegions) ? entry.deferredRegions : [];
      if (!knownModes.includes(entry.toolMode)) entry.warnings.push(`Unknown toolMode: ${entry.toolMode}`);
      if (!entry.runtimeEligibility) entry.runtimeEligibility = 'not-runtime-approved';
    }
    return { ...json, entries };
  }

  async function loadDefaultRegistry() {
    try {
      const response = await fetch(DEFAULT_REGISTRY_PATH, { cache: 'no-store' });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const json = await response.json();
      setRegistry(json, DEFAULT_REGISTRY_PATH);
    } catch (error) {
      showLoadFailure(error);
    }
  }

  function showLoadFailure(error) {
    els.viewerTitle.textContent = 'Registry load needed';
    els.viewerContent.innerHTML = `
      <p class="warning">The bundled registry could not be loaded automatically.</p>
      <p>This is common when opening <code>index.html</code> directly with <code>file://</code>. Use the file picker and select:</p>
      <pre>tools/glyphforge/registry/glyphforge-visual-registry.v0.1.json</pre>
      <p>Or serve the repo with any already available local static server and open this folder through HTTP.</p>
      <pre>${escapeHtml(error.message)}</pre>
    `;
  }

  function setRegistry(json, sourceLabel) {
    state.registry = normalizeRegistry(json);
    state.entries = state.registry.entries;
    state.filtered = state.entries.slice();
    state.selected = state.filtered[0] || null;
    state.activeMode = state.selected?.toolMode || 'dashboard-launcher';

    populateFilters();
    applyFilters();
    renderAll(sourceLabel);
  }

  function populateFilters() {
    setSelectOptions(els.domainFilter, 'All games/domains', unique(state.entries.map((entry) => entry.gameSlug || entry.domain)));
    setSelectOptions(els.toolModeFilter, 'All tool modes', unique(state.entries.map((entry) => entry.toolMode)));
    setSelectOptions(els.reviewFilter, 'All review states', unique(state.entries.map((entry) => entry.reviewStatus)));
    setSelectOptions(els.runtimeFilter, 'All runtime states', unique(state.entries.map((entry) => entry.runtimeEligibility)));
  }

  function applyFilters() {
    const query = els.searchInput.value.trim().toLowerCase();
    const domain = els.domainFilter.value;
    const toolMode = els.toolModeFilter.value;
    const review = els.reviewFilter.value;
    const runtime = els.runtimeFilter.value;

    state.filtered = state.entries.filter((entry) => {
      const haystack = JSON.stringify(entry).toLowerCase();
      return (!query || haystack.includes(query))
        && (!domain || entry.gameSlug === domain || entry.domain === domain)
        && (!toolMode || entry.toolMode === toolMode)
        && (!review || entry.reviewStatus === review)
        && (!runtime || entry.runtimeEligibility === runtime);
    });

    if (!state.filtered.includes(state.selected)) {
      state.selected = state.filtered[0] || null;
    }
  }

  function renderAssetList() {
    els.entryCount.textContent = state.filtered.length;
    if (!state.filtered.length) {
      els.assetList.innerHTML = '<p>No entries match the current filters.</p>';
      return;
    }

    els.assetList.innerHTML = state.filtered.map((entry) => `
      <button class="asset-card ${entry === state.selected ? 'active' : ''}" type="button" data-entry-id="${escapeHtml(entry.entryId)}">
        <span class="asset-title">${escapeHtml(entry.displayName)}</span>
        <span class="asset-meta">${escapeHtml(entry.toolMode)} • ${escapeHtml(entry.reviewStatus)} • ${escapeHtml(entry.runtimeEligibility)}</span>
      </button>
    `).join('');

    for (const button of els.assetList.querySelectorAll('.asset-card')) {
      button.addEventListener('click', () => {
        state.selected = state.entries.find((entry) => entry.entryId === button.dataset.entryId);
        state.activeMode = state.selected?.toolMode || state.activeMode;
        renderAll();
      });
    }
  }

  function renderBoundaryStrip() {
    const entry = state.selected;
    if (!entry) {
      els.boundaryStrip.innerHTML = '<span>No entry selected. Runtime approval is never inferred.</span>';
      return;
    }

    els.boundaryStrip.innerHTML = `
      <strong>${escapeHtml(entry.displayName)}</strong>
      <span class="pill">pipelineUse: ${escapeHtml(entry.pipelineUse)}</span>
      <span class="pill">reviewStatus: ${escapeHtml(entry.reviewStatus)}</span>
      <span class="pill">runtimeEligibility: ${escapeHtml(entry.runtimeEligibility)}</span>
      <span class="danger">Runtime approval is never inferred.</span>
    `;
  }

  function renderMetadata() {
    const entry = state.selected;
    if (!entry) {
      els.metadataList.innerHTML = '';
      return;
    }
    const rows = [
      ['entryId', entry.entryId],
      ['toolMode', entry.toolMode],
      ['domain', entry.domain],
      ['assetFamily', entry.assetFamily],
      ['status', entry.status],
      ['reviewStatus', entry.reviewStatus],
      ['pipelineUse', entry.pipelineUse],
      ['runtimeEligibility', entry.runtimeEligibility]
    ];
    els.metadataList.innerHTML = rows.map(([key, value]) => `<dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd>`).join('');
  }

  function renderWarnings() {
    const entry = state.selected;
    if (!entry) {
      els.warningsPanel.innerHTML = '<p>No entry selected.</p>';
      return;
    }
    const warnings = entry.warnings || [];
    const denied = entry.deniedRegions || [];
    const deferred = entry.deferredRegions || [];
    els.warningsPanel.innerHTML = `
      ${warnings.length ? `<ul>${warnings.map((warning) => `<li class="warning">${escapeHtml(warning)}</li>`).join('')}</ul>` : '<p class="ok">No warnings recorded in registry.</p>'}
      ${denied.length ? `<p><strong>Denied/excluded regions:</strong> ${escapeHtml(denied.join(', '))}</p>` : ''}
      ${deferred.length ? `<p><strong>Deferred regions:</strong> ${escapeHtml(deferred.join(', '))}</p>` : ''}
      ${entry.futurePantryOnly ? '<p class="warning">Future pantry only.</p>' : ''}
      ${entry.historical ? '<p class="warning">Historical/fallback record.</p>' : ''}
    `;
  }

  function renderPaths() {
    const entry = state.selected;
    if (!entry) {
      els.pathsPanel.innerHTML = '<p>No entry selected.</p>';
      return;
    }
    const paths = [
      ['Manifest', entry.manifestPath],
      ['Source', entry.sourcePath],
      ['Derived', entry.derivedPath],
      ...((entry.evidencePaths || []).map((evidencePath, index) => [`Evidence ${index + 1}`, evidencePath]))
    ].filter(([, value]) => value);

    els.pathsPanel.innerHTML = `<ul>${paths.map(([label, value]) => `<li><strong>${escapeHtml(label)}:</strong> <code>${escapeHtml(value)}</code></li>`).join('')}</ul>`;
  }

  function renderDashboard() {
    const entries = state.entries;
    return `
      <p>Loaded <strong>${entries.length}</strong> registry entries. This is a static local review shell; nothing here approves runtime use.</p>
      ${countsHtml('By tool mode', countBy(entries, 'toolMode'))}
      ${countsHtml('By review status', countBy(entries, 'reviewStatus'))}
      ${countsHtml('By runtime eligibility', countBy(entries, 'runtimeEligibility'))}
    `;
  }

  function renderRegionBrowser(entry) {
    const counts = entry.counts || {};
    return `
      <h3>Region / Asset Browser summary</h3>
      <p>This is the first useful implemented summary mode. It displays manifest paths, cleanup/readiness state, region counts, and exclusions without editing anything.</p>
      <div class="summary-grid">
        ${Object.entries(counts).map(([key, value]) => `<div class="summary-tile"><span class="summary-value">${escapeHtml(value)}</span>${escapeHtml(key)}</div>`).join('') || '<p>No counts recorded.</p>'}
      </div>
      <p><strong>Source:</strong> <code>${escapeHtml(entry.sourcePath || 'not recorded')}</code></p>
      <p><strong>Derived:</strong> <code>${escapeHtml(entry.derivedPath || 'none')}</code></p>
    `;
  }

  function renderModePlaceholder(entry, mode) {
    const labels = {
      'flipbook-viewer': 'Flipbook Viewer placeholder',
      'scene-composition-editor': 'Scene Composition / Layout Editor placeholder',
      'particle-fx-viewer': 'Particle FX Viewer placeholder',
      'audio-viewer-placeholder': 'Future Audio Viewer placeholder'
    };
    const notes = {
      'flipbook-viewer': 'Routes animation manifests here and shows counts/metadata. Full playback is future work.',
      'scene-composition-editor': 'Routes scene-anchor/background manifests here. Drag layout/export remains future planning.',
      'particle-fx-viewer': 'Routes particle/FX records here. FX preview and preset authoring remain future work.',
      'audio-viewer-placeholder': 'Audio remains Tier 2.5. No playback or audio pipeline is implemented.'
    };
    return `
      <h3>${escapeHtml(labels[mode] || 'Mode placeholder')}</h3>
      <p>${escapeHtml(notes[mode] || 'This mode is not implemented yet.')}</p>
      <div class="summary-grid">
        ${Object.entries(entry.counts || {}).map(([key, value]) => `<div class="summary-tile"><span class="summary-value">${escapeHtml(value)}</span>${escapeHtml(key)}</div>`).join('') || '<p>No counts recorded.</p>'}
      </div>
    `;
  }

  function renderViewer() {
    const entry = state.selected;
    if (!state.registry) {
      els.viewerTitle.textContent = 'Load registry';
      els.viewerContent.innerHTML = '<p>Load the bundled registry or use the file picker.</p>';
      return;
    }

    if (state.activeMode === 'dashboard-launcher' || !entry) {
      els.viewerTitle.textContent = 'Dashboard / Launcher';
      els.viewerContent.innerHTML = renderDashboard();
      return;
    }

    els.viewerTitle.textContent = `${entry.displayName}`;
    if (state.activeMode === 'region-asset-browser') {
      els.viewerContent.innerHTML = renderRegionBrowser(entry);
    } else {
      els.viewerContent.innerHTML = renderModePlaceholder(entry, state.activeMode);
    }
  }

  function renderRawJson() {
    els.rawJsonPreview.textContent = JSON.stringify(state.selected || state.registry || {}, null, 2);
  }

  function renderTabs() {
    for (const tab of document.querySelectorAll('.mode-tab')) {
      tab.classList.toggle('active', tab.dataset.mode === state.activeMode);
    }
  }

  function renderAll() {
    renderAssetList();
    renderTabs();
    renderBoundaryStrip();
    renderViewer();
    renderMetadata();
    renderWarnings();
    renderPaths();
    renderRawJson();
  }

  function attachEvents() {
    els.loadDefaultBtn.addEventListener('click', loadDefaultRegistry);
    els.registryFileInput.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      setRegistry(JSON.parse(text), file.name);
    });

    for (const element of [els.searchInput, els.domainFilter, els.toolModeFilter, els.reviewFilter, els.runtimeFilter]) {
      element.addEventListener('input', () => {
        applyFilters();
        renderAll();
      });
    }

    for (const tab of document.querySelectorAll('.mode-tab')) {
      tab.addEventListener('click', () => {
        state.activeMode = tab.dataset.mode;
        renderAll();
      });
    }
  }

  attachEvents();
  loadDefaultRegistry();
}());
