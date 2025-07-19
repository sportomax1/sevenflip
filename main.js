class Flip7Game {
    constructor() {
        this.deck = [];
        this.discardPile = [];
        this.players = [
            { id: 'human', name: 'You', score: 0, tableau: [], roundScore: 0, hasSecondChance: false, isActive: true },
            { id: 'ai1', name: 'AI Player 1', score: 0, tableau: [], roundScore: 0, hasSecondChance: false, isActive: true },
            { id: 'ai2', name: 'AI Player 2', score: 0, tableau: [], roundScore: 0, hasSecondChance: false, isActive: true }
        ];
        this.currentPlayerIndex = 0;
        this.gameOver = false;
        this.winner = null;
        
        this.initializeDeck();
        this.setupEventListeners();
        this.updateUI();
        this.log('Game started! Your turn first.');
    }

    initializeDeck() {
        this.deck = [];
        
        // Number cards: 1x0, 1x1, 2x2, 3x3, ..., 12x12
        for (let i = 0; i <= 12; i++) {
            const count = i === 0 || i === 1 ? 1 : i;
            for (let j = 0; j < count; j++) {
                this.deck.push({ type: 'number', value: i, display: i.toString() });
            }
        }
        
        // Action cards: 3x each
        const actionCards = ['Second Chance', 'Flip Three', 'Freeze'];
        actionCards.forEach(action => {
            for (let i = 0; i < 3; i++) {
                this.deck.push({ type: 'action', value: action, display: action });
            }
        });
        
        // Bonus cards: +2, +4, +6, +8, +10
        const bonusValues = [2, 4, 6, 8, 10];
        bonusValues.forEach(value => {
            this.deck.push({ type: 'bonus', value: value, display: `+${value}` });
        });
        
        // Multiplier card: ×2
        this.deck.push({ type: 'multiplier', value: 2, display: '×2' });
        
        this.shuffleDeck();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    drawCard() {
        if (this.deck.length === 0) {
            if (this.discardPile.length === 0) {
                this.log('No cards left to draw!');
                return null;
            }
            this.log('Reshuffling discard pile into deck...');
            this.deck = [...this.discardPile];
            this.discardPile = [];
            this.shuffleDeck();
        }
        
        return this.deck.pop();
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    nextPlayer() {
        do {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        } while (!this.players[this.currentPlayerIndex].isActive);
    }

    checkBust(player, card) {
        if (card.type === 'number') {
            const duplicate = player.tableau.find(c => c.type === 'number' && c.value === card.value);
            if (duplicate) {
                if (player.hasSecondChance) {
                    this.log(`${player.name} used Second Chance to avoid bust!`);
                    player.hasSecondChance = false;
                    // Remove both the duplicate and the Second Chance card
                    player.tableau = player.tableau.filter(c => !(c.type === 'number' && c.value === card.value));
                    player.tableau = player.tableau.filter(c => c.type !== 'action' || c.value !== 'Second Chance');
                    return false;
                } else {
                    this.log(`${player.name} busted! Duplicate number card: ${card.value}`);
                    this.bustPlayer(player);
                    return true;
                }
            }
        }
        return false;
    }

    bustPlayer(player) {
        player.tableau = [];
        player.roundScore = 0;
        player.isActive = false;
        this.log(`${player.name} lost all cards and round points!`);
    }

    checkFlip7(player) {
        const numberCards = player.tableau.filter(card => card.type === 'number');
        const uniqueNumbers = new Set(numberCards.map(card => card.value));
        
        if (uniqueNumbers.size === 7) {
            this.log(`${player.name} achieved Flip 7! +15 bonus points!`);
            player.roundScore += 15;
            return true;
        }
        return false;
    }

    calculateScore(player) {
        if (!player.isActive && player.roundScore === 0) {
            return 0;
        }

        let score = 0;
        const numberCards = player.tableau.filter(card => card.type === 'number');
        const bonusCards = player.tableau.filter(card => card.type === 'bonus');
        const multiplierCards = player.tableau.filter(card => card.type === 'multiplier');

        // Sum of number cards
        score = numberCards.reduce((sum, card) => sum + card.value, 0);

        // Apply multiplier (×2) only to number card sum
        if (multiplierCards.length > 0) {
            score *= 2;
            this.log(`${player.name} applied ×2 multiplier to number cards!`);
        }

        // Add bonus cards
        const bonusSum = bonusCards.reduce((sum, card) => sum + card.value, 0);
        score += bonusSum;

        // Add round score (includes Flip 7 bonus)
        score += player.roundScore;

        return score;
    }

    handleActionCard(player, card) {
        switch (card.value) {
            case 'Second Chance':
                if (!player.hasSecondChance) {
                    player.hasSecondChance = true;
                    this.log(`${player.name} gained Second Chance protection!`);
                }
                break;
            case 'Flip Three':
                this.log(`${player.name} used Flip Three! Drawing 3 cards...`);
                for (let i = 0; i < 3; i++) {
                    const drawnCard = this.drawCard();
                    if (drawnCard) {
                        if (!this.checkBust(player, drawnCard)) {
                            player.tableau.push(drawnCard);
                            this.checkFlip7(player);
                        }
                    }
                }
                break;
            case 'Freeze':
                // AI will use Freeze on human player
                if (player.id.startsWith('ai')) {
                    const humanPlayer = this.players.find(p => p.id === 'human');
                    if (humanPlayer && humanPlayer.isActive) {
                        this.log(`${player.name} used Freeze on you! You must stay.`);
                        this.forceStay(humanPlayer);
                    }
                }
                break;
        }
    }

    forceStay(player) {
        const score = this.calculateScore(player);
        player.score += score;
        player.roundScore = 0;
        player.isActive = false;
        this.log(`${player.name} was forced to stay with ${score} points.`);
    }

    hit() {
        const player = this.getCurrentPlayer();
        if (!player.isActive) {
            this.log("This player is not active!");
            return;
        }

        const card = this.drawCard();
        if (!card) return;

        this.log(`${player.name} drew: ${card.display}`);

        if (card.type === 'action') {
            this.handleActionCard(player, card);
            player.tableau.push(card);
        } else {
            if (!this.checkBust(player, card)) {
                player.tableau.push(card);
                this.checkFlip7(player);
            }
        }

        this.updateUI();
    }

    stay() {
        const player = this.getCurrentPlayer();
        if (!player.isActive) {
            this.log("This player is not active!");
            return;
        }

        const score = this.calculateScore(player);
        player.score += score;
        player.roundScore = 0;
        player.isActive = false;
        
        this.log(`${player.name} stayed with ${score} points. Total score: ${player.score}`);

        if (player.score >= 200) {
            this.endGame(player);
            return;
        }

        this.nextPlayer();
        this.updateUI();
        
        if (this.getCurrentPlayer().id.startsWith('ai')) {
            setTimeout(() => this.aiTurn(), 1000);
        }
    }

    aiTurn() {
        const ai = this.getCurrentPlayer();
        if (!ai.isActive) {
            this.nextPlayer();
            this.updateUI();
            return;
        }

        this.log(`${ai.name}'s turn...`);

        // AI decision logic
        const numberCards = ai.tableau.filter(card => card.type === 'number');
        const uniqueNumbers = new Set(numberCards.map(card => card.value));
        const currentScore = this.calculateScore(ai);

        // Check if AI should use action cards
        const freezeCard = ai.tableau.find(card => card.type === 'action' && card.value === 'Freeze');
        if (freezeCard) {
            const humanPlayer = this.players.find(p => p.id === 'human');
            if (humanPlayer && humanPlayer.isActive) {
                this.log(`${ai.name} used Freeze on you!`);
                this.forceStay(humanPlayer);
                ai.tableau = ai.tableau.filter(card => card !== freezeCard);
            }
        }

        const flipThreeCard = ai.tableau.find(card => card.type === 'action' && card.value === 'Flip Three');
        if (flipThreeCard && currentScore < 12) {
            this.log(`${ai.name} used Flip Three!`);
            this.handleActionCard(ai, flipThreeCard);
            ai.tableau = ai.tableau.filter(card => card !== flipThreeCard);
        }

        // AI hit/stay decision
        if (currentScore >= 18 || uniqueNumbers.size >= 6) {
            setTimeout(() => this.stay(), 500);
        } else {
            setTimeout(() => this.hit(), 500);
        }
    }

    endGame(winner) {
        this.gameOver = true;
        this.winner = winner;
        this.log(`🎉 ${winner.name} wins the game with ${winner.score} points!`);
        this.updateUI();
    }

    newGame() {
        this.deck = [];
        this.discardPile = [];
        this.players = [
            { id: 'human', name: 'You', score: 0, tableau: [], roundScore: 0, hasSecondChance: false, isActive: true },
            { id: 'ai1', name: 'AI Player 1', score: 0, tableau: [], roundScore: 0, hasSecondChance: false, isActive: true },
            { id: 'ai2', name: 'AI Player 2', score: 0, tableau: [], roundScore: 0, hasSecondChance: false, isActive: true }
        ];
        this.currentPlayerIndex = 0;
        this.gameOver = false;
        this.winner = null;
        
        this.initializeDeck();
        this.updateUI();
        this.log('New game started! Your turn first.');
    }

    updateUI() {
        // Update scores
        document.getElementById('human-score').textContent = this.players[0].score;
        document.getElementById('ai1-score').textContent = this.players[1].score;
        document.getElementById('ai2-score').textContent = this.players[2].score;
        document.getElementById('human-round-score').textContent = this.calculateScore(this.players[0]);

        // Update deck count
        document.getElementById('deck-count').textContent = `Cards in deck: ${this.deck.length}`;

        // Update current turn
        const currentPlayer = this.getCurrentPlayer();
        document.getElementById('current-turn').textContent = `${currentPlayer.name}'s turn`;

        // Update player cards
        this.updatePlayerCards('human', this.players[0]);
        this.updatePlayerCards('ai1', this.players[1]);
        this.updatePlayerCards('ai2', this.players[2]);

        // Update active states
        this.players.forEach((player, index) => {
            const playerElement = document.getElementById(`${player.id}-player`);
            if (playerElement) {
                playerElement.classList.toggle('active', index === this.currentPlayerIndex);
                playerElement.classList.toggle('bust', !player.isActive && player.roundScore === 0);
            }
        });

        // Update button states
        const isHumanTurn = currentPlayer.id === 'human';
        const isGameOver = this.gameOver;
        
        document.getElementById('hit-btn').disabled = !isHumanTurn || isGameOver;
        document.getElementById('stay-btn').disabled = !isHumanTurn || isGameOver;
        document.getElementById('view-cards-btn').disabled = isGameOver;
    }

    updatePlayerCards(playerId, player) {
        const cardsContainer = document.getElementById(`${playerId}-cards`);
        cardsContainer.innerHTML = '';

        player.tableau.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.type}`;
            cardElement.textContent = card.display;
            cardElement.title = `${card.type}: ${card.display}`;
            cardsContainer.appendChild(cardElement);
        });
    }

    log(message) {
        const logContent = document.getElementById('log-content');
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContent.appendChild(logEntry);
        logContent.scrollTop = logContent.scrollHeight;
        console.log(message);
    }

    setupEventListeners() {
        document.getElementById('hit-btn').addEventListener('click', () => {
            if (this.getCurrentPlayer().id === 'human') {
                this.hit();
            }
        });

        document.getElementById('stay-btn').addEventListener('click', () => {
            if (this.getCurrentPlayer().id === 'human') {
                this.stay();
            }
        });

        document.getElementById('view-cards-btn').addEventListener('click', () => {
            this.showCardsModal();
        });

        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.newGame();
        });

        // Modal close functionality
        const modal = document.getElementById('cards-modal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    showCardsModal() {
        const modal = document.getElementById('cards-modal');
        const modalCards = document.getElementById('modal-cards');
        const humanPlayer = this.players[0];

        modalCards.innerHTML = '';
        
        if (humanPlayer.tableau.length === 0) {
            modalCards.innerHTML = '<p>No cards in your tableau.</p>';
        } else {
            humanPlayer.tableau.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = `card ${card.type}`;
                cardElement.textContent = card.display;
                cardElement.title = `${card.type}: ${card.display}`;
                modalCards.appendChild(cardElement);
            });
        }

        modal.style.display = 'block';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Flip7Game();
}); 