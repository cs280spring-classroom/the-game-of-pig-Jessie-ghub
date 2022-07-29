var stu = 'Jessie';
describe('Required', () => {
	beforeEach(() => {
		cy.visit('https://cs280spring-classroom.github.io/the-game-of-pig-' + stu + '-ghub/');
	});

	// issue1: 'width: 0px' doesn't work
	it('1. When the game starts, players score (and turn total) must be zero (i.e., both progress bars are empty).', () => {
		cy.get('#p1-score').should('have.attr', 'style').and('include', 'width: 0%');
		cy.get('#p1-hold').should('have.attr', 'style').and('include', 'width: 0%');
		cy.get('#p2-score').should('have.attr', 'style').and('include', 'width: 0%');
		cy.get('#p2-hold').should('have.attr', 'style').and('include', 'width: 0%');
	});

	it('2. When the game starts, it must be player-1s turn to roll the die.', () => {
		cy.contains('Player-1 turn!');
	});

	it('3. When the game starts, the "Roll" and "Hold" buttons must be active (i.e., enabled).', () => {
		cy.get('#roll').click({ force: true });
		cy.get('#hold').click({ force: true });
	});

	// issue2: cannot be sure it's random
	it('4. When the "Roll" button is clicked, the program must simulate rolling a die and reflect the outcome on the UI by updating the die face.', () => {
		cy.get('#roll').click();
		cy.get('#die').should(($btn) => {
			expect($btn.text()).to.contains.oneOf([ '⚀', '⚁', '⚂', '⚃', '⚄', '⚅' ]);
		});
	});

	//Suppose player-X rolled the die, and it landed on a value other than 1. Then, the outcome must be added to player-X's "turn total" and reflected on the UI (i.e., player-X's progress bar must be updated to show the new turn total).
	it('5. Suppose player-X rolled the die, and it landed on a value other than 1. Then, the outcome must be added to player-Xs "turn total" and reflected on the UI (i.e., player-Xs progress bar must be updated to show the new turn total).', () => {
		let playerBefore;
		let playerAfter;
		let add;

		let p1Hold = 0;
		let p2Hold = 0;

		var genArr = Array.from({ length: 15 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			// check who's turn it is before roll
			cy.get('#result').then(($result) => {
				playerBefore = $result.text();
			});

			// roll the dice and expect outcome
			cy.get('#roll').click({ force: true });
			cy.get('#die').should(($btn) => {
				const text = $btn.text();
				if (text.includes('⚀')) {
					add = 0;
				} else if (text.includes('⚁')) {
					add = 2;
				} else if (text.includes('⚂')) {
					add = 3;
				} else if (text.includes('⚃')) {
					add = 4;
				} else if (text.includes('⚄')) {
					add = 5;
				} else if (text.includes('⚅')) {
					add = 6;
				}
			});

			console.log('roll' + add);

			// get the result message after roll
			cy.get('#result').then(($result) => {
				playerAfter = $result.text();
				// if should switch player
				if (add == 0) {
					assert.notEqual(playerBefore, playerAfter, 'vals not equal');
					// the other player hold value should equal 0
					if (playerAfter.includes('Player-1')) {
						cy.get('#p2-hold').should('have.attr', 'style').and('include', 'width: 0%');
						p2Hold = 0;
					} else {
						cy.get('#p1-hold').should('have.attr', 'style').and('include', 'width: 0%');
						p1Hold = 0;
					}
				} else {
					assert.equal(playerBefore, playerAfter, 'vals equal');
					if (playerBefore.includes('Player-1')) {
						p1Hold += add;
						cy.get('#p1-hold').should('have.attr', 'style').and('include', 'width: ' + p1Hold + '%');
					} else {
						p2Hold += add;
						cy.get('#p2-hold').should('have.attr', 'style').and('include', 'width: ' + p2Hold + '%');
					}
				}
			});
		});
	});

	it('6. The progress bar for each player must show two bars: one for the players score (unless the score is zero) and the other for the players turn total (unless the turn total is zero).', () => {
		let player;
		var genArr = Array.from({ length: 15 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			cy.get('#result').then(($result) => {
				player = $result.text();
			});
			cy.get('#roll').click({ force: true });
			cy.get('#die').then(($btn) => {
				const text = $btn.text();
				if (text.includes('⚀')) {
				} else if (player.includes('Player-1')) {
					cy.get('#p1-hold').invoke('outerWidth').should('be.gt', 0.1);
				} else {
					cy.get('#p2-hold').invoke('outerWidth').should('be.gt', 0.1);
				}
			});
		});

		cy.wrap(genArr).each(() => {
			cy.get('#roll').click({ force: true });
			cy.get('#hold').click({ force: true });
		});
		cy.get('#p1-score').invoke('outerWidth').should('be.gt', 0.1);
		cy.get('#p2-score').invoke('outerWidth').should('be.gt', 0.1);
	});

	it('7. The progress bar for each player must use the primary bootstrap color (i.e., royal blue) for scores. It must use an animated striped "info" bootstrap color (turquoise) for turn total.', () => {
		cy.get('#p1-score').should('have.attr', 'class').and('include', 'progress-bar');
		cy.get('#p1-score').should('have.attr', 'class').and('include', 'progress-bar');
		cy.get('#p1-hold').should('have.attr', 'class').and('include', 'progress-bar-striped');
		cy.get('#p1-hold').should('have.attr', 'class').and('include', 'progress-bar-animated');
		cy.get('#p1-hold').should('have.attr', 'class').and('include', 'bg-info');
		cy.get('#p2-hold').should('have.attr', 'class').and('include', 'progress-bar-striped');
		cy.get('#p2-hold').should('have.attr', 'class').and('include', 'progress-bar-animated');
		cy.get('#p2-hold').should('have.attr', 'class').and('include', 'bg-info');
	});

	it('8. Suppose player-1 rolled the die, and it landed on a value other than 1. Then, the progress bar for player-2 must remain unchanged. (And vice versa.)', () => {
		let player1ScoreBefore;
		let player2ScoreBefore;
		let player;
		var genArr = Array.from({ length: 5 }, (v, k) => k + 1);

		cy.wrap(genArr).each((index) => {
			// roll the dice and expect outcome
			cy.get('#roll').click({ force: true });
			cy.get('#hold').click({ force: true });
		});

		cy.wrap(genArr).each((index) => {
			cy.get('#p1-score').invoke('attr', 'style').then(function(width) {
				player1ScoreBefore = width;
			});

			cy.get('#p2-score').invoke('attr', 'style').then(function(width) {
				player2ScoreBefore = width;
			});

			cy.get('#roll').click({ force: true });
			cy.get('#result').then(($result) => {
				player = $result.text();
			});

			cy.get('#die').then(($btn) => {
				const text = $btn.text();
				let player1ScoreAfter = 0;
				let player2ScoreAfter = 0;
				if (text.includes('⚀')) {
				} else if (player.includes('Player-2')) {
					cy.get('#p1-score').invoke('attr', 'style').then(function(width) {
						player1ScoreAfter = width;
						assert.equal(player1ScoreBefore, player1ScoreAfter, 'vals equal');
					});
				} else if (player.includes('Player-1')) {
					cy.get('#p2-score').invoke('attr', 'style').then(function(width) {
						player2ScoreAfter = width;
						assert.equal(player2ScoreBefore, player2ScoreAfter, 'vals equal');
					});
				}
			});
		});
	});

	it('9. Suppose player-X rolled the die, and it landed on a value other than 1. Then, the UI must continue to show "Player-X turn!"', () => {
		let playerBefore;
		let playerAfter;
		var genArr = Array.from({ length: 5 }, (v, k) => k + 1);

		cy.wrap(genArr).each((index) => {
			cy.get('#result').then(($result) => {
				playerBefore = $result.text();
				if (playerBefore.includes('Player-1 turn!')) {
				} else if (playerBefore.includes('Player-2 turn!')) {
				} else {
					assert.equal(1, 2, 'error: result should be in format "Player-X turn!"');
				}
			});
			cy.get('#roll').click({ force: true });
			cy.get('#result').then(($result) => {
				playerAfter = $result.text();
				if (playerAfter.includes('Player-1 turn!')) {
				} else if (playerAfter.includes('Player-2 turn!')) {
				} else {
					assert.equal(1, 2, 'error: result should be in format "Player-X turn!"');
				}
			});

			cy.get('#die').then(($btn) => {
				const text = $btn.text();
				if (text.includes('⚀')) {
				} else {
					assert.equal(playerBefore, playerAfter, 'vals equal');
				}
			});
		});
	});

	it('10. Suppose player-X rolled the die. Irrespective of the outcome, the player-Xs score must not change. (Unless adding the outcome to the score would result in a value greater or equal to 100. There is another spec to cover this edge case).', () => {
		var genArr = Array.from({ length: 5 }, (v, k) => k + 1);

		cy.wrap(genArr).each((index) => {
			// roll the dice and expect outcome
			cy.get('#roll').click({ force: true });
			cy.get('#hold').click({ force: true });
		});
		cy.get('#hold').click({ force: true });
		cy.checkScoreRemainSameAfterRoll(genArr);
	});

	Cypress.Commands.add('checkScoreRemainSameAfterRoll', (genArr) => {
		let player1ScoreBefore;
		let player2ScoreBefore;
		let player1ScoreAfter;
		let player2ScoreAfter;

		cy.get('#p1-score').invoke('attr', 'style').then(function(width) {
			player1ScoreBefore = width;
		});
		cy.get('#p2-score').invoke('attr', 'style').then(function(width) {
			player2ScoreBefore = width;
		});

		cy.wrap(genArr).each((index) => {
			cy.get('#roll').click({ force: true });
		});
		cy.get('#p1-score').invoke('attr', 'style').then(function(width) {
			player1ScoreAfter = width;
			assert.equal(player1ScoreBefore, player1ScoreAfter, 'vals equal');
		});
		cy.get('#p2-score').invoke('attr', 'style').then(function(width) {
			player2ScoreAfter = width;
			assert.equal(player2ScoreBefore, player2ScoreAfter, 'vals equal');
		});
	});
});
