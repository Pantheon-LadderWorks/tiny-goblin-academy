(function initCardVfxForgeCore(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.CardVfxForgeCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function buildCardVfxForgeCore() {
  'use strict';

  const RECIPE_SCHEMA = 'tga.card-vfx-forge-candidate.v0.1';
  const ATTACHMENT_AUTHORITIES = [
    'card-local',
    'draw-pile-local',
    'discard-pile-local',
    'player-target',
    'enemy-target',
    'travel',
    'tabletop-local'
  ];
  const PHASE_KEYS = ['prepareMs', 'actionMs', 'impactMs', 'holdMs', 'decayMs', 'cleanupMs'];
  const MAIN_FRAME_IDS = ['none', 'gold-ornate', 'wood', 'bone'];
  const SLOT_SURFACE_IDS = ['green-slot', 'teal-slot', 'gold-glow', 'red-corners', 'gray-gold'];

  const ASSET_PATHS = Object.freeze({
    frames: '../../../assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-card-frames-cleaned-v0.1.png',
    tokens: '../../../assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-ui-tokens-cleaned-v0.1.png',
    tabletop: '../../../assets/academy/games/card-goblin-duel/backgrounds/tga-card-goblin-duel-tabletop-scene-v0.1.png'
  });

  const CARD_CATALOG = Object.freeze({
    strike: {
      label: 'Strike', description: 'Deal 2 damage.', color: '#f0a55a', accent: '#ffe0a0',
      faceRect: [4, 27, 123, 170], tokenRect: [2, 2, 120, 124], activation: 'slash'
    },
    guard: {
      label: 'Guard', description: 'Reduce next enemy damage by 2.', color: '#5ed5d1', accent: '#d6fff9',
      faceRect: [259, 27, 123, 170], tokenRect: [130, 2, 124, 124], activation: 'shield'
    },
    mend: {
      label: 'Mend', description: 'Heal 2 HP.', color: '#77d27a', accent: '#e5ffd2',
      faceRect: [132, 27, 123, 170], tokenRect: [258, 2, 124, 124], activation: 'heal'
    },
    spark: {
      label: 'Spark', description: 'Deal 1 damage and replace one card.', color: '#ffd45a', accent: '#fff4b0',
      faceRect: [514, 27, 123, 170], tokenRect: [386, 2, 124, 124], activation: 'spark'
    },
    stun: {
      label: 'Stun', description: 'Prevent the next enemy attack once.', color: '#77dce0', accent: '#fff0a8',
      faceRect: [259, 27, 123, 170], tokenRect: [642, 2, 124, 124], activation: 'stun'
    },
    'heavy-bonk': {
      label: 'Heavy Bonk', description: 'Deal 4 damage; skip next draw.', color: '#d49555', accent: '#ffe0a0',
      faceRect: [386, 27, 124, 170], tokenRect: [514, 2, 124, 124], activation: 'bonk'
    }
  });

  const FRAME_CATALOG = Object.freeze({
    none: {
      label: 'None', rect: null, classification: 'valid-null-baseline', group: 'main',
      manifestId: null, note: 'Default. No additional outer-frame overlay.'
    },
    'gold-ornate': {
      label: 'Gold ornate open frame', rect: [641, 824, 125, 189], classification: 'valid-transparent-overlay', group: 'main',
      manifestId: 'card-goblin-duel.card-frames.card-front-frame.gold-ornate-open-frame',
      note: 'A true open frame, but visually competes with several existing face families.'
    },
    wood: {
      label: 'Wood open frame', rect: [769, 824, 125, 189], classification: 'valid-transparent-overlay', group: 'main',
      manifestId: 'card-goblin-duel.card-frames.card-front-frame.wood-open-card-frame',
      note: 'Geometrically calm true open frame. No rarity or origin meaning assigned.'
    },
    bone: {
      label: 'Corner ornate open frame', rect: [897, 824, 125, 189], classification: 'usable-visually-provisional', group: 'main',
      manifestId: 'card-goblin-duel.card-frames.card-front-frame.corner-ornate-open-frame',
      note: 'The downloaded prototype called this bone. The governed identity is corner ornate open frame.'
    }
  });

  const SLOT_CATALOG = Object.freeze({
    'green-slot': {
      label: 'Green board slot', rect: [4, 558, 123, 160], classification: 'board-slot-surface',
      manifestId: 'card-goblin-duel.card-frames.board-slot.green-board-card-slot',
      note: 'Stable environmental socket. Not a CardRig outer frame.'
    },
    'teal-slot': {
      label: 'Teal board slot', rect: [386, 558, 124, 160], classification: 'board-slot-surface',
      manifestId: 'card-goblin-duel.card-frames.board-slot.teal-board-card-slot',
      note: 'Stable environmental socket. Not a CardRig outer frame.'
    },
    'gold-glow': {
      label: 'Gold glowing empty slot', rect: [641, 555, 126, 167], classification: 'highlighted-slot-state',
      manifestId: 'card-goblin-duel.card-frames.highlighted-card-state.gold-glowing-empty-card-slot',
      note: 'Highlighted environmental slot state for focus, selection, or incoming placement review.'
    },
    'red-corners': {
      label: 'Red corner card slot', rect: [769, 558, 125, 160], classification: 'card-slot-surface',
      manifestId: 'card-goblin-duel.card-frames.card-slot.red-corner-card-slot',
      note: 'Environmental card-slot surface with danger/aggression language.'
    },
    'gray-gold': {
      label: 'Gray/gold corner card slot', rect: [898, 559, 122, 159], classification: 'card-slot-surface',
      manifestId: 'card-goblin-duel.card-frames.card-slot.gray-gold-corner-card-slot',
      note: 'Environmental card-slot surface with crafted/valuable language.'
    }
  });

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function mod(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function normalizedDelta(from, to) {
    return Number(mod(to - from, 1).toFixed(12));
  }

  function validatedGeometry(width, height, radius) {
    const w = Number(width);
    const h = Number(height);
    const r = Number(radius);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      throw new Error('Rounded rectangle width and height must be positive finite numbers.');
    }
    if (!Number.isFinite(r) || r < 0 || r > Math.min(w, h) / 2) {
      throw new Error('Rounded rectangle radius must fit inside the rectangle.');
    }
    return { width: w, height: h, radius: r };
  }

  function roundedRectPerimeter(width, height, radius) {
    const geometry = validatedGeometry(width, height, radius);
    return 2 * (geometry.width - 2 * geometry.radius)
      + 2 * (geometry.height - 2 * geometry.radius)
      + 2 * Math.PI * geometry.radius;
  }

  function sampleRoundedRectPerimeter(width, height, radius, progress) {
    const geometry = validatedGeometry(width, height, radius);
    const { width: w, height: h, radius: r } = geometry;
    const top = w - 2 * r;
    const side = h - 2 * r;
    const corner = Math.PI * r / 2;
    const perimeter = roundedRectPerimeter(w, h, r);
    let distance = mod(Number(progress), 1) * perimeter;

    function edge(length, segment, pointAt, tangentX, tangentY) {
      if (distance <= length || length === 0) {
        const t = length === 0 ? 1 : distance / length;
        return { ...pointAt(t), tangentX, tangentY, segment, progress: mod(Number(progress), 1) };
      }
      distance -= length;
      return null;
    }

    function arc(centerX, centerY, startAngle, segment) {
      if (distance <= corner || corner === 0) {
        const t = corner === 0 ? 1 : distance / corner;
        const angle = startAngle + t * Math.PI / 2;
        return {
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r,
          tangentX: -Math.sin(angle),
          tangentY: Math.cos(angle),
          segment,
          progress: mod(Number(progress), 1)
        };
      }
      distance -= corner;
      return null;
    }

    return edge(top, 'top', t => ({ x: r + top * t, y: 0 }), 1, 0)
      || arc(w - r, r, -Math.PI / 2, 'top-right-corner')
      || edge(side, 'right', t => ({ x: w, y: r + side * t }), 0, 1)
      || arc(w - r, h - r, 0, 'bottom-right-corner')
      || edge(top, 'bottom', t => ({ x: w - r - top * t, y: h }), -1, 0)
      || arc(r, h - r, Math.PI / 2, 'bottom-left-corner')
      || edge(side, 'left', t => ({ x: 0, y: h - r - side * t }), 0, -1)
      || arc(r, r, Math.PI, 'top-left-corner');
  }

  function createTrace(width, height, radius, headProgress, arcLength, sampleCount, id) {
    const points = [];
    for (let index = 0; index <= sampleCount; index += 1) {
      const progress = headProgress - arcLength + arcLength * (index / sampleCount);
      points.push(sampleRoundedRectPerimeter(width, height, radius, progress));
    }
    return { id, headProgress: mod(headProgress, 1), arcLength, points };
  }

  function createTwinTracePlan(options) {
    const width = Number(options.width);
    const height = Number(options.height);
    const radius = Number(options.radius);
    const progress = mod(Number(options.progress ?? 0), 1);
    const arcLength = clamp(Number(options.arcLength ?? 0.18), 0.02, 0.45);
    const samples = Math.max(8, Math.floor(Number(options.samples ?? 36)));
    validatedGeometry(width, height, radius);
    return {
      perimeter: roundedRectPerimeter(width, height, radius),
      traces: [
        createTrace(width, height, radius, progress, arcLength, samples, 'trace-a'),
        createTrace(width, height, radius, progress + 0.5, arcLength, samples, 'trace-b')
      ]
    };
  }

  function borderMotionMode(borderId, reducedMotion) {
    return reducedMotion && borderId === 'trace' ? 'pulse' : borderId;
  }

  function createDefaultRecipe(cardId = 'heavy-bonk') {
    if (!Object.hasOwn(CARD_CATALOG, cardId)) throw new Error(`Unknown card identity: ${cardId}`);
    const card = CARD_CATALOG[cardId];
    return {
      schema: RECIPE_SCHEMA,
      cardId,
      visualState: cardId === 'heavy-bonk' ? 'resting' : 'focused',
      baseFaceFamily: cardId,
      surfaceRecipe: {
        outerFrame: null,
        borderEffect: { id: cardId === 'heavy-bonk' ? 'trace' : 'pulse', attachment: 'card-local' },
        faceEffect: { id: cardId === 'heavy-bonk' ? 'dust' : 'shine', attachment: 'card-local' }
      },
      activationRecipe: { id: card.activation, attachment: cardId === 'guard' || cardId === 'mend' ? 'player-target' : 'enemy-target' },
      parameters: {
        effectColor: card.color,
        accentColor: card.accent,
        intensity: cardId === 'heavy-bonk' ? 58 : 54,
        speed: cardId === 'heavy-bonk' ? 72 : 100,
        density: cardId === 'heavy-bonk' ? 6 : 7,
        glow: cardId === 'heavy-bonk' ? 28 : 24,
        borderWidth: 2,
        scale: 1,
        loop: true
      },
      lifecycle: {
        prepareMs: 160,
        actionMs: 260,
        impactMs: 140,
        holdMs: 120,
        decayMs: 260,
        cleanupMs: 80
      },
      reducedMotion: { enabled: false, substitutions: [{ from: 'trace', to: 'pulse' }] }
    };
  }

  function requireFiniteNumber(value, label, minimum = 0) {
    if (!Number.isFinite(Number(value)) || Number(value) < minimum) {
      throw new Error(`${label} must be a finite number greater than or equal to ${minimum}.`);
    }
  }

  function validateEffect(effect, label) {
    if (!effect || typeof effect !== 'object' || typeof effect.id !== 'string' || !effect.id) {
      throw new Error(`${label} must declare an effect id.`);
    }
    if (!ATTACHMENT_AUTHORITIES.includes(effect.attachment)) {
      throw new Error(`${label} attachment must be one of the governed attachment authorities.`);
    }
  }

  function validateRecipe(recipe) {
    if (!recipe || typeof recipe !== 'object') throw new Error('Recipe must be an object.');
    if (recipe.schema !== RECIPE_SCHEMA) throw new Error(`Recipe schema must be ${RECIPE_SCHEMA}.`);
    if (!Object.hasOwn(CARD_CATALOG, recipe.cardId)) throw new Error('Recipe cardId is not registered.');
    if (recipe.surfaceRecipe?.outerFrame !== null && !Object.hasOwn(FRAME_CATALOG, recipe.surfaceRecipe?.outerFrame)) {
      throw new Error('Recipe outer frame is not registered.');
    }
    validateEffect(recipe.surfaceRecipe?.borderEffect, 'Border effect');
    validateEffect(recipe.surfaceRecipe?.faceEffect, 'Face effect');
    validateEffect(recipe.activationRecipe, 'Activation effect');
    for (const key of ['intensity', 'speed', 'density', 'glow', 'borderWidth', 'scale']) {
      requireFiniteNumber(recipe.parameters?.[key], key);
    }
    for (const key of PHASE_KEYS) requireFiniteNumber(recipe.lifecycle?.[key], key);
    if (!recipe.reducedMotion || typeof recipe.reducedMotion.enabled !== 'boolean' || !Array.isArray(recipe.reducedMotion.substitutions)) {
      throw new Error('Recipe reducedMotion must declare enabled and substitutions.');
    }
    return recipe;
  }

  function serializeRecipe(recipe) {
    return `${JSON.stringify(validateRecipe(recipe), null, 2)}\n`;
  }

  function parseRecipe(text) {
    let parsed;
    try {
      parsed = JSON.parse(String(text));
    } catch (error) {
      throw new Error(`Recipe JSON is malformed: ${error.message}`);
    }
    return validateRecipe(parsed);
  }

  function buildPhaseTimeline(lifecycle) {
    let cursor = 0;
    const timeline = PHASE_KEYS.map(key => {
      requireFiniteNumber(lifecycle?.[key], key);
      const startMs = cursor;
      cursor += Number(lifecycle[key]);
      return { id: key, label: key.replace(/Ms$/, '').replace(/([A-Z])/g, ' $1').trim(), startMs, endMs: cursor, durationMs: Number(lifecycle[key]) };
    });
    Object.defineProperty(timeline, 'totalMs', { value: cursor, enumerable: true });
    return timeline;
  }

  return Object.freeze({
    RECIPE_SCHEMA,
    ATTACHMENT_AUTHORITIES,
    PHASE_KEYS,
    MAIN_FRAME_IDS,
    SLOT_SURFACE_IDS,
    ASSET_PATHS,
    CARD_CATALOG,
    FRAME_CATALOG,
    SLOT_CATALOG,
    normalizedDelta,
    roundedRectPerimeter,
    sampleRoundedRectPerimeter,
    createTwinTracePlan,
    borderMotionMode,
    createDefaultRecipe,
    validateRecipe,
    serializeRecipe,
    parseRecipe,
    buildPhaseTimeline
  });
});
