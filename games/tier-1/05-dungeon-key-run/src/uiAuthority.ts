import type {AcademyTypographyRole} from '../../../../assets/academy/fonts/runtime/academy-typography';

export const DUNGEON_KEY_TYPOGRAPHY_ROLES = Object.freeze({
  academyBrand: 'compact-label',
  gameTitle: 'game-title',
  roomSubtitle: 'compact-label',
  objectiveKicker: 'compact-label',
  objectiveHeading: 'panel-heading',
  objectiveBody: 'body-instruction',
  statusChip: 'data-value',
  feedback: 'dialogue-speech',
  result: 'result-state',
  drawerKicker: 'compact-label',
  drawerTitle: 'dialogue-title',
  drawerBody: 'dialogue-speech',
  ledgerEntry: 'dialogue-speech',
  controlLabel: 'compact-label',
} satisfies Record<string, AcademyTypographyRole>);

export const DUNGEON_KEY_UI_STATES = Object.freeze([
  'rest',
  'hover',
  'focus-visible',
  'pressed',
  'disabled',
  'open',
] as const);

export const DUNGEON_KEY_UI_AUTHORITY = Object.freeze({
  id: 'tga-05.typography-shared-ui.v0.1',
  minimumViewport: Object.freeze({width: 1024, height: 640}),
  stageDominant: true,
  permanentHistoryRail: false,
  approvedFamilies: Object.freeze([
    'Cinzel',
    'Caudex',
    'Outfit',
    'Atkinson Hyperlegible',
  ]),
  shellDestinations: Object.freeze(['ledger-drawer', 'help-drawer']),
  input: Object.freeze({
    movementKeys: Object.freeze(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']),
    ledgerShortcut: 'l',
    closeShortcut: 'Escape',
    drawerBlocksMovement: true,
    drawerTrapsFocus: true,
    restoreFocusOnClose: true,
  }),
});

export type DungeonKeyDrawerId = typeof DUNGEON_KEY_UI_AUTHORITY.shellDestinations[number];
