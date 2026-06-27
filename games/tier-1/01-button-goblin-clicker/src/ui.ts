import { GameController, StateListener } from './controller';

export const setupUI = (controller: GameController) => {
  const coinsDisplay = document.getElementById('coins-display');
  const damageDisplay = document.getElementById('damage-display');
  const goblinDisplay = document.getElementById('goblin-display');
  const hpDisplay = document.getElementById('hp-display');
  const shopButton = document.getElementById('shop-btn') as HTMLButtonElement;
  const victoryOverlay = document.getElementById('victory-overlay');

  if (!coinsDisplay || !damageDisplay || !shopButton || !victoryOverlay || !hpDisplay || !goblinDisplay) {
    console.error('Missing UI elements');
    return;
  }

  // Handle Shop Click
  shopButton.addEventListener('click', () => {
    controller.buyBonkStick();
  });

  // Handle state updates
  const updateUI: StateListener = (state) => {
    coinsDisplay.textContent = state.coins.toString();
    damageDisplay.textContent = state.damage.toString();
    goblinDisplay.textContent = `${state.goblinIndex} / 10`;
    hpDisplay.textContent = `${state.currentGoblinHp} / ${state.maxGoblinHp}`;

    if (state.victory) {
      victoryOverlay.classList.add('visible');
      shopButton.disabled = true;
    } else {
      victoryOverlay.classList.remove('visible');
      
      // Shop logic
      if (state.bonkStickPurchased) {
        shopButton.textContent = 'Purchased!';
        shopButton.disabled = true;
      } else {
        shopButton.disabled = state.coins < 3;
        if (!shopButton.disabled) {
          shopButton.textContent = 'Buy (3 coins)';
        } else {
          shopButton.textContent = 'Need 3 more coins';
        }
      }
    }
  };

  // Subscribe
  controller.subscribe(updateUI);
};
