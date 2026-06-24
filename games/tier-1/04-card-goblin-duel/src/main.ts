import Phaser from 'phaser';
import './style.css';
import { createGame, playCard, resolveSparkChoice, GameState, Card } from './simulation';

let state = createGame();

const CARD_DESC: Record<Card, string> = {
    'Strike': 'Deal 2 damage.',
    'Guard': 'Reduce next enemy damage by 2.',
    'Mend': 'Heal 2 HP.',
    'Spark': 'Deal 1 damage and replace one card.',
    'Stun': 'Prevent the next enemy attack once.',
    'Heavy Bonk': 'Deal 4 damage; skip next draw.'
};

let phaserScene: Phaser.Scene;
let playerAvatar: Phaser.GameObjects.Text;
let goblinAvatar: Phaser.GameObjects.Text;

new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'canvas',
    width: 600,
    height: 260,
    backgroundColor: '#24192f',
    scene: {
        create() {
            phaserScene = this;
            // Draw simple avatars since we don't have sprites yet
            playerAvatar = this.add.text(100, 100, '🧙‍♂️', { fontSize: '64px' }).setOrigin(0.5);
            this.add.text(100, 160, 'YOU', { fontSize: '18px', color: '#fff1c6' }).setOrigin(0.5);

            this.add.text(300, 100, '⚔️', { fontSize: '48px' }).setOrigin(0.5);

            goblinAvatar = this.add.text(500, 100, '👺', { fontSize: '64px' }).setOrigin(0.5);
            this.add.text(500, 160, 'CARD GOBLIN', { fontSize: '18px', color: '#fff1c6' }).setOrigin(0.5);
        }
    }
});

const hud = document.querySelector('#hud')!;
const hand = document.querySelector('#hand')!;
const log = document.querySelector('#log')!;
const banner = document.querySelector('#banner')!;
const next = document.querySelector('#next')!;

const renderCard = (c: Card, index: number, isPreview = false) => {
    return `
        <button class="card-btn" data-i="${index}" ${state.phase === 'Terminal' || isPreview ? 'disabled' : ''}>
            <div class="card-title">${c}</div>
            <div class="card-desc">${CARD_DESC[c]}</div>
        </button>
    `;
};

const render = () => {
    // 1. HUD Stats
    hud.innerHTML = `
        <div class="hud-entry">
            <div class="hud-label">Player HP</div>
            <div class="hud-value">${Math.max(0, state.playerHp)} / 10</div>
        </div>
        <div class="hud-entry">
            <div class="hud-label">Goblin HP</div>
            <div class="hud-value">${Math.max(0, state.enemyHp)} / 12</div>
        </div>
        <div class="hud-entry">
            <div class="hud-label">Status</div>
            <div style="font-size: 14px; color: #d1b4c4">
                Guard: ${state.guard} <br/>
                Stun: ${state.stun ? 'Active' : 'None'}
            </div>
        </div>
    `;

    // 2. Phase Banner & Body Class
    if (state.phase === 'PlayerAction') {
        banner.textContent = 'Your Turn';
        document.body.className = '';
    } else if (state.phase === 'SparkChoice') {
        banner.textContent = 'Spark Effect: Select a card to replace';
        document.body.className = 'phase-spark';
    } else if (state.phase === 'Terminal') {
        banner.textContent = state.playerHp <= 0 ? 'DEFEAT' : 'VICTORY';
        document.body.className = '';
    }

    // 3. Hand
    hand.innerHTML = state.hand.map((c, i) => renderCard(c, i)).join('');

    // 4. Next Card Preview (Top of queue)
    if (state.queue.length > 0) {
        next.innerHTML = renderCard(state.queue[0], -1, true);
    } else {
        next.innerHTML = '<div style="color:#d1b4c4; text-align:center; padding: 20px;">Queue Empty</div>';
    }

    // 5. Action Ledger
    // Show only the last 8 logs to keep it clean
    log.innerHTML = state.log.slice(-8).map(x => `<li>${x}</li>`).join('');

    // 6. Bind Events
    document.querySelectorAll('#hand .card-btn').forEach(b => {
        const btn = b as HTMLButtonElement;
        btn.onclick = () => {
            const idx = +btn.dataset.i!;
            
            // Simple visual animation on avatar
            if (phaserScene) {
                phaserScene.tweens.add({
                    targets: playerAvatar,
                    y: playerAvatar.y - 10,
                    duration: 50,
                    yoyo: true
                });
            }

            if (state.phase === 'PlayerAction') {
                state = playCard(state, idx);
            } else if (state.phase === 'SparkChoice') {
                state = resolveSparkChoice(state, idx);
            }
            render();
        };
    });
};

render();
