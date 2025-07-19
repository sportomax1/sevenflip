# 🎴 Flip 7 Card Game

A browser-based implementation of the Flip 7 card game with AI opponents. Play against two AI players in this strategic card game where you must balance risk and reward to reach 200 points first!

## 🎮 How to Play

### Game Setup
- **Players**: 1 human player vs 2 AI opponents
- **Deck**: 94 total cards
- **Goal**: Be the first player to reach 200+ points

### Card Types

#### Number Cards (79 total)
- 1× 0, 1× 1, 2× 2, 3× 3, ..., 12× 12
- These are the main scoring cards

#### Action Cards (9 total)
- **3× Second Chance**: Protects against busting once per player
- **3× Flip Three**: Draw 3 cards immediately
- **3× Freeze**: Force any player to stay immediately

#### Bonus/Modifier Cards (6 total)
- **+2, +4, +6, +8, +10**: Add points to your score
- **×2**: Multiplies your number card total (only affects number cards)

### Game Rules

#### Turn Actions
On your turn, you must choose:
- **Hit**: Draw the next card from the deck
- **Stay**: Bank your current points and sit out for the round

#### Busting
- If you draw a duplicate number card (already in your tableau), you **bust**
- You lose all round points and your entire tableau is discarded
- **Exception**: Second Chance card can save you from busting once

#### Flip 7 Bonus
- If you collect 7 unique number cards, you immediately get a **+15 bonus**
- This is added to your round score

#### Scoring
At the end of each round:
1. Sum all number cards in your tableau
2. Apply ×2 multiplier (if you have one) to the number card sum only
3. Add any bonus cards (+2 to +10)
4. Add +15 if you achieved Flip 7
5. Add this to your total score

#### Game End
- First player to reach 200+ points wins
- If all players bust or stay, the round ends and scores are tallied

### AI Behavior
The AI players follow these strategies:
- **Hit** until score ≥ 18 or they have 6 unique cards
- **Use Freeze** on the human player when possible
- **Use Flip Three** only if their score is < 12

## 🚀 How to Run

1. **Download/Clone** the game files
2. **Open** `index.html` in your web browser
3. **Start playing** immediately!

No installation or dependencies required - it's a pure HTML/CSS/JavaScript game.

## 🎯 Game Controls

- **Hit**: Draw a card
- **Stay**: Bank your current score and end your turn
- **View Cards**: See your current tableau in detail
- **New Game**: Start a fresh game

## 🎨 Features

- **Modern UI**: Clean, responsive design with smooth animations
- **Real-time Updates**: Live score tracking and game state
- **Game Log**: Detailed history of all game events
- **Visual Feedback**: Cards are color-coded by type
- **AI Opponents**: Intelligent computer players
- **Mobile Friendly**: Works on desktop and mobile devices

## 🃏 Card Colors

- **Blue**: Number cards
- **Red**: Action cards
- **Green**: Bonus cards
- **Orange**: Multiplier cards

## 🏆 Strategy Tips

1. **Balance Risk vs Reward**: Don't get greedy - staying with a good score is often better than risking a bust
2. **Use Action Cards Wisely**: Save Second Chance for when you really need it
3. **Watch for Flip 7**: Getting 7 unique numbers is a huge bonus
4. **Monitor Opponents**: Keep track of what cards AI players have
5. **Plan Your Multiplier**: ×2 only affects number cards, so maximize their value

## 🔧 Technical Details

- **Language**: Pure JavaScript (ES6+)
- **No Dependencies**: Vanilla HTML, CSS, and JavaScript
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **File Structure**:
  - `index.html` - Main game interface
  - `main.js` - Game logic and AI
  - `styles.css` - Visual styling
  - `README.md` - This file

## 🎲 Game Statistics

- **Total Cards**: 94
- **Number Cards**: 79 (0-12 with varying quantities)
- **Action Cards**: 9 (3 of each type)
- **Bonus Cards**: 5 (+2, +4, +6, +8, +10)
- **Multiplier Cards**: 1 (×2)

Enjoy playing Flip 7! 🎴✨ 