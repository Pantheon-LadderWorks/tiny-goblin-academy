export type Card = 'Strike' | 'Guard' | 'Mend' | 'Spark' | 'Stun' | 'Heavy Bonk';
export type Phase = 'PlayerAction' | 'SparkChoice' | 'Terminal';

export type GameState = {
    phase: Phase;
    hand: Card[];
    queue: Card[];
    playerHp: number;
    enemyHp: number;
    guard: number;
    stun: boolean;
    skip: boolean;
    log: string[];
};

const allCards: Card[] = ['Strike', 'Guard', 'Mend', 'Spark', 'Stun', 'Heavy Bonk'];

export const createGame = (): GameState => ({
    phase: 'PlayerAction',
    hand: allCards.slice(0, 3),
    queue: allCards.slice(3),
    playerHp: 10,
    enemyHp: 12,
    guard: 0,
    stun: false,
    skip: false,
    log: ['Duel Start. Your turn. Play a card.']
});

const drawToHand = (s: GameState) => {
    while (s.hand.length < 3 && s.queue.length > 0) {
        s.hand.push(s.queue.shift()!);
    }
};

const checkTerminal = (s: GameState) => {
    if (s.enemyHp <= 0) {
        s.phase = 'Terminal';
        s.log.push('Victory! You defeated the Card Goblin.');
        return true;
    }
    if (s.playerHp <= 0) {
        s.phase = 'Terminal';
        s.log.push('Defeat. The Card Goblin bested you.');
        return true;
    }
    return false;
};

const resolveEnemyTurn = (s: GameState) => {
    if (checkTerminal(s)) return;

    if (s.stun) {
        s.stun = false;
        s.log.push('Card Goblin is stunned and skips their attack.');
    } else {
        const damage = Math.max(0, 2 - s.guard);
        s.guard = 0;
        s.playerHp -= damage;
        s.log.push(`Card Goblin attacks for 2. Guard reduced it to ${damage}.`);
    }

    checkTerminal(s);
};

export const playCard = (state: GameState, handIndex: number): GameState => {
    if (state.phase !== 'PlayerAction') return state;

    let s = { ...state, hand: [...state.hand], queue: [...state.queue], log: [...state.log] };
    const card = s.hand.splice(handIndex, 1)[0];
    
    let damageToEnemy = 0;

    switch (card) {
        case 'Strike':
            damageToEnemy = 2;
            s.log.push('Strike deals 2 damage.');
            break;
        case 'Heavy Bonk':
            damageToEnemy = 4;
            s.skip = true;
            s.log.push('Heavy Bonk deals 4 damage. Skip Draw applied.');
            break;
        case 'Mend':
            s.playerHp = Math.min(10, s.playerHp + 2);
            s.log.push('Mend heals 2 HP.');
            break;
        case 'Guard':
            s.guard = 2;
            s.log.push('Guard reduces next attack by 2.');
            break;
        case 'Stun':
            s.stun = true;
            s.log.push('Stun prevents the next attack.');
            break;
        case 'Spark':
            damageToEnemy = 1;
            s.log.push('Spark deals 1 damage. Select a card to replace.');
            s.phase = 'SparkChoice';
            break;
    }

    if (damageToEnemy > 0) {
        s.enemyHp -= damageToEnemy;
    }

    s.queue.push(card);

    // If it's Spark, we pause for SparkChoice. Otherwise we resolve draw and enemy turn.
    if (s.phase !== 'SparkChoice') {
        if (!s.skip) {
            drawToHand(s);
        } else {
            s.skip = false;
            s.log.push('Skip Draw: no cards drawn this turn.');
        }
        resolveEnemyTurn(s);
    } else {
        checkTerminal(s); // if Spark killed the goblin, go to Terminal.
    }

    return s;
};

export const resolveSparkChoice = (state: GameState, handIndexToDiscard: number): GameState => {
    if (state.phase !== 'SparkChoice') return state;

    let s = { ...state, hand: [...state.hand], queue: [...state.queue], log: [...state.log] };
    const discardedCard = s.hand.splice(handIndexToDiscard, 1)[0];
    s.queue.push(discardedCard);
    
    s.log.push(`Replaced ${discardedCard}.`);
    
    // Draw for the Spark card AND the discarded card
    if (!s.skip) {
        drawToHand(s);
    } else {
        s.skip = false;
        s.log.push('Skip Draw: no cards drawn this turn.');
    }

    s.phase = 'PlayerAction';
    resolveEnemyTurn(s);

    return s;
};
