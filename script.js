      // Card and count data
      const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      const suits = ['♠', '♥', '♦', '♣'];

      function getCardValue(rank) {
      	if (['J', 'Q', 'K'].includes(rank)) return 10;
      	if (rank === 'A') return 11;
      	return parseInt(rank);
      }

      function getCountValue(rank) {
      	if (['2', '3', '4', '5', '6'].includes(rank)) return 1;
      	if (['7', '8', '9'].includes(rank)) return 0;
      	return -1;
      }

      function randomCard() {
      	return {
      		rank: ranks[Math.floor(Math.random() * ranks.length)],
      		suit: suits[Math.floor(Math.random() * suits.length)]
      	};
      }

      function handValue(cards) {
      	let total = 0;
      	let aces = 0;
      	for (const c of cards) {
      		total += getCardValue(c.rank);
      		if (c.rank === 'A') aces++;
      	}
      	while (total > 21 && aces > 0) {
      		total -= 10;
      		aces--;
      	}
      	return total;
      }

      function isSoftHand(cards) {
      	let total = 0,
      		aces = 0;
      	for (const c of cards) {
      		total += getCardValue(c.rank);
      		if (c.rank === 'A') aces++;
      	}
      	return aces > 0 && total <= 21;
      }
      // Detect pair (for splits)
      function isPair(cards) {
      	return cards.length === 2 && cards[0].rank === cards[1].rank;
      }

      function renderCard(card) {
      	const el = document.createElement('div');
      	el.className = 'card';
      	el.title = `${card.rank} of ${
          card.suit === '♠'
            ? 'Spades'
            : card.suit === '♥'
            ? 'Hearts'
            : card.suit === '♦'
            ? 'Diamonds'
            : 'Clubs'
        }`;
      	const rankSpan = document.createElement('div');
      	rankSpan.className = 'rank';
      	rankSpan.textContent = card.rank;
      	const suitSpan = document.createElement('div');
      	suitSpan.className = 'suit ' + (card.suit === '♥' || card.suit === '♦' ? 'heart' : 'spade');
      	suitSpan.textContent = card.suit;
      	el.appendChild(rankSpan);
      	el.appendChild(suitSpan);
      	return el;
      }
      // Game variables
      let runningCount = 0;
      let totalCardsDealt = 0;
      let decks = 6;
      let shoeSize = decks * 52;
      let currentScenario = null;
      let playerHand = [];
      let dealerCard = null;
      const runningCountSpan = document.getElementById('runningCount');
      const trueCountSpan = document.getElementById('trueCount');
      const dealerUpcardDiv = document.getElementById('dealerUpcard');
      const playerHandDiv = document.getElementById('playerHand');
      const playerTotalDiv = document.getElementById('playerTotal');
      const logDiv = document.getElementById('log');
      // Buttons
      const hitBtn = document.getElementById('hitBtn');
      const standBtn = document.getElementById('standBtn');
      const doubleBtn = document.getElementById('doubleBtn');
      const splitBtn = document.getElementById('splitBtn');
      const nextBtn = document.getElementById('nextBtn');
      // Basic Strategy Table (hard totals, soft totals, splits)
      // Reference: Standard Vegas rules, no surrender
      // "H"=Hit, "S"=Stand, "D"=Double if allowed, else Hit, "Ds"=Double if allowed else Stand, "P"=Split
      const basicStrategy = {
      	hard: {
      		// Player total : dealer card => action
      		8: {
      			2: 'H',
      			3: 'H',
      			4: 'H',
      			5: 'D',
      			6: 'D',
      			7: 'H',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		9: {
      			2: 'D',
      			3: 'D',
      			4: 'D',
      			5: 'D',
      			6: 'D',
      			7: 'H',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		10: {
      			2: 'D',
      			3: 'D',
      			4: 'D',
      			5: 'D',
      			6: 'D',
      			7: 'D',
      			8: 'D',
      			9: 'D',
      			10: 'H',
      			1: 'H'
      		},
      		11: {
      			2: 'D',
      			3: 'D',
      			4: 'D',
      			5: 'D',
      			6: 'D',
      			7: 'D',
      			8: 'D',
      			9: 'D',
      			10: 'D',
      			1: 'H'
      		},
      		12: {
      			2: 'H',
      			3: 'H',
      			4: 'S',
      			5: 'S',
      			6: 'S',
      			7: 'H',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		13: {
      			2: 'S',
      			3: 'S',
      			4: 'S',
      			5: 'S',
      			6: 'S',
      			7: 'H',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		14: {
      			2: 'S',
      			3: 'S',
      			4: 'S',
      			5: 'S',
      			6: 'S',
      			7: 'H',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		15: {
      			2: 'S',
      			3: 'S',
      			4: 'S',
      			5: 'S',
      			6: 'S',
      			7: 'H',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		16: {
      			2: 'S',
      			3: 'S',
      			4: 'S',
      			5: 'S',
      			6: 'S',
      			7: 'H',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		17: {
      			2: 'S',
      			3: 'S',
      			4: 'S',
      			5: 'S',
      			6: 'S',
      			7: 'S',
      			8: 'S',
      			9: 'S',
      			10: 'S',
      			1: 'S'
      		},
      		18: {
      			2: 'S',
      			3: 'S',
      			4: 'S',
      			5: 'S',
      			6: 'S',
      			7: 'S',
      			8: 'S',
      			9: 'S',
      			10: 'S',
      			1: 'S'
      		},
      		19: {
      			2: 'S',
      			3: 'S',
      			4: 'S',
      			5: 'S',
      			6: 'S',
      			7: 'S',
      			8: 'S',
      			9: 'S',
      			10: 'S',
      			1: 'S'
      		},
      		20: {
      			2: 'S',
      			3: 'S',
      			4: 'S',
      			5: 'S',
      			6: 'S',
      			7: 'S',
      			8: 'S',
      			9: 'S',
      			10: 'S',
      			1: 'S'
      		},
      		21: {
      			2: 'S',
      			3: 'S',
      			4: 'S',
      			5: 'S',
      			6: 'S',
      			7: 'S',
      			8: 'S',
      			9: 'S',
      			10: 'S',
      			1: 'S'
      		},
      	},
      	soft: {
      		// Player total including A (soft 13 = A+2, soft 14 = A+3,... up to A+9)
      		13: {
      			2: 'H',
      			3: 'H',
      			4: 'H',
      			5: 'D',
      			6: 'D',
      			7: 'H',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		14: {
      			2: 'H',
      			3: 'H',
      			4: 'H',
      			5: 'D',
      			6: 'D',
      			7: 'H',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		15: {
      			2: 'H',
      			3: 'H',
      			4: 'D',
      			5: 'D',
      			6: 'D',
      			7: 'H',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		16: {
      			2: 'H',
      			3: 'H',
      			4: 'D',
      			5: 'D',
      			6: 'D',
      			7: 'H',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		17: {
      			2: 'H',
      			3: 'D',
      			4: 'D',
      			5: 'D',
      			6: 'D',
      			7: 'H',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		18: {
      			2: 'S',
      			3: 'D',
      			4: 'D',
      			5: 'D',
      			6: 'D',
      			7: 'S',
      			8: 'S',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		19: {
      			2: 'S',
      			3: 'S',
      			4: 'S',
      			5: 'S',
      			6: 'D',
      			7: 'S',
      			8: 'S',
      			9: 'S',
      			10: 'S',
      			1: 'S'
      		},
      		20: {
      			2: 'S',
      			3: 'S',
      			4: 'S',
      			5: 'S',
      			6: 'S',
      			7: 'S',
      			8: 'S',
      			9: 'S',
      			10: 'S',
      			1: 'S'
      		},
      		21: {
      			2: 'S',
      			3: 'S',
      			4: 'S',
      			5: 'S',
      			6: 'S',
      			7: 'S',
      			8: 'S',
      			9: 'S',
      			10: 'S',
      			1: 'S'
      		},
      	},
      	pairs: {
      		'A': {
      			2: 'P',
      			3: 'P',
      			4: 'P',
      			5: 'P',
      			6: 'P',
      			7: 'P',
      			8: 'P',
      			9: 'P',
      			10: 'P',
      			1: 'P'
      		},
      		'10': {
      			2: 'S',
      			3: 'S',
      			4: 'S',
      			5: 'S',
      			6: 'S',
      			7: 'S',
      			8: 'S',
      			9: 'S',
      			10: 'S',
      			1: 'S'
      		},
      		'9': {
      			2: 'P',
      			3: 'P',
      			4: 'P',
      			5: 'P',
      			6: 'P',
      			7: 'S',
      			8: 'P',
      			9: 'P',
      			10: 'S',
      			1: 'S'
      		},
      		'8': {
      			2: 'P',
      			3: 'P',
      			4: 'P',
      			5: 'P',
      			6: 'P',
      			7: 'P',
      			8: 'P',
      			9: 'P',
      			10: 'P',
      			1: 'P'
      		},
      		'7': {
      			2: 'P',
      			3: 'P',
      			4: 'P',
      			5: 'P',
      			6: 'P',
      			7: 'P',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		'6': {
      			2: 'P',
      			3: 'P',
      			4: 'P',
      			5: 'P',
      			6: 'P',
      			7: 'H',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		'5': {
      			2: 'D',
      			3: 'D',
      			4: 'D',
      			5: 'D',
      			6: 'D',
      			7: 'D',
      			8: 'D',
      			9: 'D',
      			10: 'H',
      			1: 'H'
      		},
      		'4': {
      			2: 'H',
      			3: 'H',
      			4: 'H',
      			5: 'P',
      			6: 'P',
      			7: 'H',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		'3': {
      			2: 'P',
      			3: 'P',
      			4: 'P',
      			5: 'P',
      			6: 'P',
      			7: 'P',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      		'2': {
      			2: 'P',
      			3: 'P',
      			4: 'P',
      			5: 'P',
      			6: 'P',
      			7: 'P',
      			8: 'H',
      			9: 'H',
      			10: 'H',
      			1: 'H'
      		},
      	}
      };
      // Deviation Index Plays (Illustrious 18, true count indices)
      // Format: {playerHand: [dealerCard: trueCountIndex, ...]}
      // Actions override basic strategy: 'H', 'S', 'D', 'Ds' (double if allowed else stand), 'Rh' (surrender, here no surrender, so stand), 'Rh' means stand here.
      // Note: No surrender
      const deviationTable = [
      	// Format: player hand string, dealer upcard, true count threshold, deviation action
      	// Player hands are stringified (ex: '16', '15', '10,10', '12', 'Ace,6')
      	// 1. 16 vs 10: Stand if TC >= 0 else Hit (basic strat says hit)
      	{
      		hand: '16',
      		dealer: 10,
      		tc: 0,
      		action: 'S'
      	},
      	// 2. 15 vs 10: Stand if TC >= 4 else Hit
      	{
      		hand: '15',
      		dealer: 10,
      		tc: 4,
      		action: 'S'
      	},
      	// 3. 10,10 vs 5: Split if TC >= 5 else Stand (basic strat stand)
      	{
      		hand: '10,10',
      		dealer: 5,
      		tc: 5,
      		action: 'P'
      	},
      	// 4. 10,10 vs 6: Split if TC >= 4 else Stand
      	{
      		hand: '10,10',
      		dealer: 6,
      		tc: 4,
      		action: 'P'
      	},
      	// 5. 12 vs 3: Stand if TC >= 2 else Hit
      	{
      		hand: '12',
      		dealer: 3,
      		tc: 2,
      		action: 'S'
      	},
      	// 6. 12 vs 2: Stand if TC >= 3 else Hit
      	{
      		hand: '12',
      		dealer: 2,
      		tc: 3,
      		action: 'S'
      	},
      	// 7. 9 vs 2: Double if TC >= 1 else Hit
      	{
      		hand: '9',
      		dealer: 2,
      		tc: 1,
      		action: 'D'
      	},
      	// 8. 9 vs 7: Double if TC >= 3 else Hit
      	{
      		hand: '9',
      		dealer: 7,
      		tc: 3,
      		action: 'D'
      	},
      	// 9. 11 vs A: Double if TC >= 1 else Hit
      	{
      		hand: '11',
      		dealer: 1,
      		tc: 1,
      		action: 'D'
      	},
      	// 10. 10 vs A: Double if TC >= 4 else Hit
      	{
      		hand: '10',
      		dealer: 1,
      		tc: 4,
      		action: 'D'
      	},
      	// 11. Ace,7 (soft 18) vs 2: Double if TC >= 1 else Stand
      	{
      		hand: 'A,7',
      		dealer: 2,
      		tc: 1,
      		action: 'D'
      	},
      	// 12. Ace,7 vs 7: Stand if TC >= 3 else Hit
      	{
      		hand: 'A,7',
      		dealer: 7,
      		tc: 3,
      		action: 'H'
      	},
      	// 13. Ace,7 vs 9: Hit if TC < 4 else Stand
      	{
      		hand: 'A,7',
      		dealer: 9,
      		tc: 4,
      		action: 'S'
      	},
      ];
      // Helper to stringify a hand for deviation lookup
      function handToString(cards) {
      	if (isPair(cards)) return `${cards[0].rank},${cards[1].rank}`;
      	if (cards.length === 2 && cards.some(c => c.rank === 'A')) {
      		// soft hand
      		// Sort ranks for consistency: A, then other card
      		const other = cards.find(c => c.rank !== 'A');
      		return `A,${other.rank}`;
      	}
      	return handValue(cards).toString();
      }
      // Translate dealer card rank to 1-10 (Ace=1)
      function dealerRankToNum(rank) {
      	if (rank === 'A') return 1;
      	if (['J', 'Q', 'K'].includes(rank)) return 10;
      	return parseInt(rank);
      }
      // Get recommended action from basic strategy, considering pair/soft/hard
      function getBasicStrategyAction(playerCards, dealerUp) {
      	const dealerNum = dealerRankToNum(dealerUp.rank);
      	if (isPair(playerCards)) {
      		const pairRank = playerCards[0].rank === 'J' || playerCards[0].rank === 'Q' || playerCards[0].rank === 'K' ? '10' : playerCards[0].rank;
      		const pairActions = basicStrategy.pairs[pairRank];
      		if (pairActions) {
      			let act = pairActions[dealerNum];
      			if (act === 'D') act = 'D'; // double allowed
      			else if (act === 'Ds') act = 'D'; // double else stand
      			return act || 'H';
      		}
      	}
      	if (isSoftHand(playerCards)) {
      		const softTotal = handValue(playerCards);
      		const softActions = basicStrategy.soft[softTotal];
      		if (softActions) {
      			let act = softActions[dealerNum];
      			if (act === 'D' || act === 'Ds') act = 'D';
      			return act || 'H';
      		}
      	}
      	// Hard totals
      	const hardTotal = handValue(playerCards);
      	if (hardTotal <= 8) return 'H';
      	const hardActions = basicStrategy.hard[hardTotal];
      	if (hardActions) {
      		let act = hardActions[dealerNum];
      		if (act === 'D' || act === 'Ds') act = 'D';
      		return act || 'H';
      	}
      	return 'S'; // fallback
      }
      // Check if the hand matches any deviation
      function getDeviationAction(playerCards, dealerUp, trueCount) {
      	const handStr = handToString(playerCards);
      	const dealerNum = dealerRankToNum(dealerUp.rank);
      	for (const dev of deviationTable) {
      		if (dev.hand === handStr && dev.dealer === dealerNum && trueCount >= dev.tc) {
      			return dev.action;
      		}
      	}
      	return null;
      }
      // Render the current scenario cards
      function renderScenario() {
      	dealerUpcardDiv.innerHTML = '';
      	playerHandDiv.innerHTML = '';
      	dealerUpcardDiv.appendChild(renderCard(dealerCard));
      	playerHand.forEach((c) => {
      		playerHandDiv.appendChild(renderCard(c));
      	});
      	playerTotalDiv.textContent = `Total: ${handValue(playerHand)} ${
          isSoftHand(playerHand) ? '(Soft)' : ''
        }`;
      }
      // Update counts display
      function updateCountsDisplay() {
      	runningCountSpan.textContent = runningCount;
      	const cardsRemaining = shoeSize - totalCardsDealt;
      	const trueCount = cardsRemaining > 0 ? (runningCount / (cardsRemaining / 52)).toFixed(2) : 0;
      	trueCountSpan.textContent = trueCount;
      	return parseFloat(trueCount);
      }
      // Hi-Lo card counting values:
      // 2-6 are +1, 7-9 are 0, 10-Ace are -1
      function updateRunningCount(rank) {
      	if (['2', '3', '4', '5', '6'].includes(rank)) {
      		runningCount += 1;
      	} else if (['10', 'J', 'Q', 'K', 'A'].includes(rank)) {
      		runningCount -= 1;
      	}
      	// 7,8,9 count as 0, so no change
      }

      function canSplit(hand) {
      	return hand.length === 2 && hand[0].rank === hand[1].rank;
      }
      // Deal new scenario: dealer upcard + two player cards
      function newScenario() {
      	if (totalCardsDealt > shoeSize * 0.75) {
      		// Shuffle shoe reset
      		runningCount = 0;
      		totalCardsDealt = 0;
      		logDiv.innerHTML = '';
      	}
      	// Deal dealer upcard
      	dealerCard = randomCard();
      	updateRunningCount(dealerCard.rank);
      	// Deal player cards - ensure no blackjack or bust in initial hand
      	playerHand = [];
      	while (true) {
      		const card1 = randomCard();
      		const card2 = randomCard();
      		const val = handValue([card1, card2]);
      		if (val >= 4 && val <= 21) {
      			playerHand = [card1, card2];
      			break;
      		}
      	}
      	playerHand.forEach(c => updateRunningCount(c.rank));
      	totalCardsDealt += 3;
      	renderScenario();
      	updateCountsDisplay();
      	// Show recommended action on basic strat button for practice
      	const trueCount = updateCountsDisplay();
      	recommendedAction = getDeviationAction(playerHand, dealerCard, trueCount) || getBasicStrategyAction(playerHand, dealerCard);
      	hitBtn.disabled = false;
      	standBtn.disabled = false;
      	doubleBtn.disabled = false;
      	splitBtn.disabled = !canSplit(playerHand);
      	nextBtn.disabled = true;
      }
      // Convert action code to string
      function actionToString(action) {
      	switch (action) {
      		case 'H':
      			return 'Hit';
      		case 'S':
      			return 'Stand';
      		case 'D':
      			return 'Double';
      		case 'P':
      			return 'Split';
      		default:
      			return 'Unknown';
      	}
      }
      // Button event handlers to simulate a round
      hitBtn.addEventListener('click', () => {
      	logDiv.innerHTML = `You chose to

			<b>Hit</b>. Recommended:

			<b>${actionToString(recommendedAction)}</b>`;
      	hitBtn.disabled = true;
      	standBtn.disabled = true;
      	doubleBtn.disabled = true;
      	splitBtn.disabled = true;
      	nextBtn.disabled = false;
      });
      standBtn.addEventListener('click', () => {
      	logDiv.innerHTML = `You chose to

			<b>Stand</b>. Recommended:

			<b>${actionToString(recommendedAction)}</b>`;
      	hitBtn.disabled = true;
      	standBtn.disabled = true;
      	doubleBtn.disabled = true;
      	splitBtn.disabled = true;
      	nextBtn.disabled = false;
      });
      doubleBtn.addEventListener('click', () => {
      	logDiv.innerHTML = `You chose to

			<b>Double</b>. Recommended:

			<b>${actionToString(recommendedAction)}</b>`;
      	hitBtn.disabled = true;
      	standBtn.disabled = true;
      	doubleBtn.disabled = true;
      	splitBtn.disabled = true;
      	nextBtn.disabled = false;
      });
      splitBtn.addEventListener('click', () => {
      	logDiv.innerHTML = `You chose to

			<b>Split</b>. Recommended:

			<b>${actionToString(recommendedAction)}</b>`;
      	hitBtn.disabled = true;
      	standBtn.disabled = true;
      	doubleBtn.disabled = true;
      	splitBtn.disabled = true;
      	nextBtn.disabled = false;
      });
      nextBtn.addEventListener('click', () => {
      	newScenario();
      });
      // On load
      newScenario();
