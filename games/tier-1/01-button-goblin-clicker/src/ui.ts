import { GameController, StateListener } from './controller';

export const setupUI = (controller: GameController) => {
  const coinsDisplay = document.getElementById('coins-display');
  const damageDisplay = document.getElementById('damage-display');
  const shopButton = document.getElementById('shop-btn') as HTMLButtonElement;
  const victoryOverlay = document.getElementById('victory-overlay');

  if (!coinsDisplay || !damageDisplay || !shopButton || !victoryOverlay) {
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
      }
    }
  };

  // Subscribe
  controller.subscribe(updateUI);
};
