export interface RuntimeHelpContent {
  objective: string;
  controls: string;
  rules: string[];
  hint?: string;
}

const genericHelp: RuntimeHelpContent = {
  objective: 'Complete the current Academy lesson using the controls shown for the game.',
  controls: 'See the game stage for its primary interaction.',
  rules: [
    'Player-facing actions remain inside the game stage.',
    'Use Escape to close this Help surface.',
  ],
};

const runtimeHelpByGameId: Record<string, RuntimeHelpContent> = {
  'tga-02': {
    objective: 'Sort all six potions before the 30-second round ends.',
    controls: 'Mouse or touch: select the active potion, then select a destination.',
    rules: [
      'Select the active potion before choosing a destination.',
      'Choose the matching destination for the potion type.',
      'Correct destinations add 10 points and build your combo.',
      'Wrong destinations reset your combo and advance to the next potion.',
    ],
    hint: 'Time, score, combo, and immediate result feedback remain visible inside the room.',
  },
  'tga-03': {
    objective: 'Defeat the Goblin Brawler by rolling once each turn and choosing one action.',
    controls: 'Roll the d6, then choose Attack, Heal, or Block.',
    rules: [
      'Attack deals the rolled value as damage.',
      'Heal restores the rolled value, up to 10 HP.',
      'Block reduces the immediate Goblin Brawler response.',
      'After your action, the Goblin Brawler attacks for 3 before the next turn.',
      'Open History inside the stage to review the complete causal record.',
    ],
    hint: 'The current v0.1 roll order remains fixed during this shell-migration review.',
  },
};

export const getRuntimeHelpContent = (gameId: string): RuntimeHelpContent =>
  runtimeHelpByGameId[gameId] ?? genericHelp;
