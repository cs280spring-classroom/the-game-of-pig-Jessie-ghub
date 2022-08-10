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
			cy.get('#die').then(($btn) => {
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

describe('Satisfactory', () => {
	beforeEach(() => {
		cy.visit('https://cs280spring-classroom.github.io/the-game-of-pig-' + stu + '-ghub/');
	});

	it('1. The progress bar must show the numeric value for the score and turn total as a label within the bar (except when the value is zero).', () => {
		let player;
		var genArr = Array.from({ length: 7 }, (v, k) => k + 1);
		// roll and hold multiple times, score for both should be > 0
		cy.wrap(genArr).each(() => {
			cy.get('#roll').click({ force: true });
			cy.get('#hold').click({ force: true });
		});
		cy.get('#p1-score').invoke('text').then(parseFloat).should('be.gt', 0);
		cy.get('#p2-score').invoke('text').then(parseFloat).should('be.gt', 0);
		// roll and if not 1, hold should be > 0
		cy.wrap(genArr).each(() => {
			cy.get('#result').then(($result) => {
				cy.get('#roll').click({ force: true });
				player = $result.text();
				cy.get('#die').then(($btn) => {
					const text = $btn.text();
					if (text.includes('⚀')) {
					} else if (player.includes('Player-1')) {
						cy.get('#p1-hold').invoke('text').then(parseFloat).should('be.gt', 0);
					} else if (player.includes('Player-2')) {
						cy.get('#p2-hold').invoke('text').then(parseFloat).should('be.gt', 0);
					}
				});
			});
		});
	});

	it('2. Suppose player-X rolled the die, and it landed on 1. Then, player-Xs turn total must become 0.', () => {
		let player;
		var genArr = Array.from({ length: 25 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			cy.get('#result').then(($result) => {
				cy.get('#roll').click({ force: true });
				player = $result.text();
				cy.get('#die').then(($btn) => {
					const text = $btn.text();
					if (text.includes('⚀')) {
						if (player.includes('Player-1')) {
							cy.get('#p1-hold').should('have.attr', 'style').and('include', 'width: 0%');
						} else if (player.includes('Player-2')) {
							cy.get('#p2-hold').should('have.attr', 'style').and('include', 'width: 0%');
						}
					}
				});
			});
		});
	});

	it('3. Suppose a player rolled the die, and it landed on 1. Then, neither players score shall change.', () => {
		let player;
		let player1ScoreBefore;
		let player2ScoreBefore;
		var genArr = Array.from({ length: 10 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			cy.get('#p1-score').invoke('attr', 'style').then(function(width) {
				player1ScoreBefore = width;
			});
			cy.get('#p2-score').invoke('attr', 'style').then(function(width) {
				player2ScoreBefore = width;
			});
			cy.get('#result').then(($result) => {
				cy.get('#roll').click({ force: true });
				player = $result.text();
				cy.get('#die').then(($btn) => {
					const text = $btn.text();
					if (text.includes('⚀')) {
						cy.get('#p1-score').invoke('attr', 'style').then(function(width) {
							assert.equal(player1ScoreBefore, width, 'vals equal');
						});
						cy.get('#p2-score').invoke('attr', 'style').then(function(width) {
							assert.equal(player2ScoreBefore, width, 'vals equal');
						});
					}
				});
				cy.get('#hold').click({ force: true });
			});
		});
	});

	it('4. Suppose player-1 rolled the die, and it landed on 1. Then, the UI must change and show "Player-2 turn!". (And vice versa.)', () => {
		let player;
		var genArr = Array.from({ length: 20 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			cy.get('#result').then(($result) => {
				player = $result.text();
				cy.get('#roll').click({ force: true });
				cy.get('#die').then(($btn) => {
					const text = $btn.text();
					if (text.includes('⚀')) {
						if (player.includes('Player-1 turn!')) {
							cy.get('#result').then(($result) => {
								expect($result.text()).to.equal('Player-2 turn!');
							});
						} else if (player.includes('Player-2 turn!')) {
							cy.get('#result').then(($result) => {
								expect($result.text()).to.equal('Player-1 turn!');
							});
						} else {
							assert.equal(1, 2, 'result message should be in format "Player-X turn!"');
						}
					}
				});
			});
		});
	});

	it('5. Suppose player-2 clicked on the "Hold" button. Then, the UI must show "Player-1 turn!". (And vice versa.)', () => {
		let player;
		var genArr = Array.from({ length: 10 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			cy.get('#roll').click({ force: true });
			cy.get('#roll').click({ force: true });
			cy.get('#result').then(($result) => {
				player = $result.text();
				cy.get('#hold').click({ force: true });
				if (player.includes('Player-1 turn!')) {
					cy.get('#result').then(($result) => {
						expect($result.text()).to.equal('Player-2 turn!');
					});
				} else if (player.includes('Player-2 turn!')) {
					cy.get('#result').then(($result) => {
						expect($result.text()).to.equal('Player-1 turn!');
					});
				} else {
					assert.equal(1, 2, 'result message should be in format "Player-X turn!"');
				}
			});
		});
	});

	it('6. Suppose player-1 clicked on the "Hold" button. Then, the progress bar for player-2 must remain unchanged. (And vice versa.)', () => {
		let player;
		let player1ScoreBefore;
		let player2ScoreBefore;
		var genArr = Array.from({ length: 10 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			cy.get('#roll').click({ force: true });
			cy.get('#roll').click({ force: true });
			cy.get('#p1-score').invoke('attr', 'style').then(function(width) {
				player1ScoreBefore = width;
			});
			cy.get('#p2-score').invoke('attr', 'style').then(function(width) {
				player2ScoreBefore = width;
			});
			cy.get('#result').then(($result) => {
				player = $result.text();
				cy.get('#hold').click({ force: true });
				// player-1 clicked on the "Hold" button
				if (player.includes('Player-1')) {
					// the progress bar for player-2 must remain unchanged
					cy.get('#p2-score').invoke('attr', 'style').then(function(width) {
						assert.equal(player2ScoreBefore, width, 'vals equal');
					});
					// player-2 clicked on the "Hold" button
				} else if (player.includes('Player-2 turn!')) {
					// the progress bar for player-1 must remain unchanged
					cy.get('#p1-score').invoke('attr', 'style').then(function(width) {
						assert.equal(player1ScoreBefore, width, 'vals equal');
					});
				} else {
					assert.equal(1, 2, 'result message should be in format "Player-X turn!"');
				}
			});
		});
	});

	it('7. Suppose player-X clicked on the "Hold" button. Then, player-Xs "turn total" must be added to player-Xs score. This change must be reflected on the UI (i.e., player-Xs progress bar).', () => {
		let player;
		let player1ScoreBefore;
		let player2ScoreBefore;
		let player1ScoreAfter;
		let player2ScoreAfter;
		let player1Hold;
		let player2Hold;
		var genArr = Array.from({ length: 5 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			cy.get('#roll').click({ force: true });
			cy.get('#roll').click({ force: true });
			// player-Xs score before HOLD
			cy.findWidth('#p1-score').then(function(value) {
				player1ScoreBefore = value;
			});
			cy.findWidth('#p2-score').then(function(value) {
				player2ScoreBefore = value;
			});

			// player-Xs HOLD
			cy.findWidth('#p1-hold').then(function(value) {
				player1Hold = value;
			});
			cy.findWidth('#p2-hold').then(function(value) {
				player2Hold = value;
			});

			cy.get('#result').then(($result) => {
				player = $result.text();
				// Press HOLD
				cy.get('#hold').click({ force: true });
				// player-1s "turn total" should be added to player-1s score
				if (player.includes('Player-1 turn!')) {
					cy.findWidth('#p1-score').then(function(value) {
						player1ScoreAfter = value;
						assert.equal(player1ScoreBefore + player1Hold, player1ScoreAfter, 'vals equal');
					});
					// player-2s "turn total" should be added to player-2s score
				} else if (player.includes('Player-2 turn!')) {
					cy.findWidth('#p2-score').then(function(value) {
						player2ScoreAfter = value;
						assert.equal(player2ScoreBefore + player2Hold, player2ScoreAfter, 'vals equal');
					});
				} else {
					assert.equal(1, 2, 'result message should be in format "Player-X turn!"');
				}
			});
		});
	});

	// helper function to for progress bar addition check, convert width in string format to int.
	// ex. input "width: 40%", return 40
	Cypress.Commands.add('findWidth', (id) => {
		cy
			.get(id)
			.invoke('attr', 'style')
			.then((s) => {
				const start = s.indexOf(':');
				const end = s.indexOf('%', start);
				return s.slice(start + 1, end);
			})
			.then(parseInt)
			.then(function(width) {
				return width;
			});
	});

	it('8. Suppose player-X clicked on the "Hold" button. Moreover, suppose player-Xs "turn total" is added to player-Xs score. Then, player-Xs turn total must change to zero. This change must be reflected on the UI (i.e., player-Xs progress bar).', () => {
		let player;
		var genArr = Array.from({ length: 10 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			cy.get('#roll').click({ force: true });
			cy.get('#roll').click({ force: true });
			cy.get('#result').then(($result) => {
				player = $result.text();
				cy.get('#hold').click({ force: true });
				if (player.includes('Player-1 turn!')) {
					cy.get('#result').then(($result) => {
						expect($result.text()).to.equal('Player-2 turn!');
					});
				} else if (player.includes('Player-2 turn!')) {
					cy.get('#result').then(($result) => {
						expect($result.text()).to.equal('Player-1 turn!');
					});
				} else {
					assert.equal(1, 2, 'result message should be in format "Player-X turn!"');
				}
			});
		});
	});

});

describe('Complete', () => {
	beforeEach(() => {
		cy.visit('https://cs280spring-classroom.github.io/the-game-of-pig-' + stu + '-ghub/');
	});

	it('1. The numeric label on a progress bar shall not exceed the value of 100, even if a players score exceeds 100.', () => {
		var genArr = Array.from({ length: 80 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			cy.get('#roll').click({ force: true });
			cy.get('#hold').click({ force: true });
			if (cy.get('#p1-score').invoke('text').not.null) {
				cy.get('#p1-score').invoke('text').then(parseFloat).should('be.lt', 101);
			}
			if (cy.get('#p2-score').invoke('text').not.null) {
				cy.get('#p2-score').invoke('text').then(parseFloat).should('be.lt', 101);
			}
			if (cy.get('#p1-hold').invoke('text').not.null) {
				cy.get('#p1-hold').invoke('text').then(parseFloat).should('be.lt', 101);
			}
			if (cy.get('#p2-hold').invoke('text').not.null) {
				cy.get('#p2-hold').invoke('text').then(parseFloat).should('be.lt', 101);
			}
		});
	});

	it('2. Suppose player-X reached the score of 100. Then, player-X must be declared the winner, and this must be reflected on the UI.', () => {
		var genArr = Array.from({ length: 50 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			cy.get('#roll').click({ force: true });
			cy.declareWinner();
			cy.get('#roll').click({ force: true });
			cy.declareWinner();
			cy.get('#hold').click({ force: true });
			cy.declareWinner();
		});
	});

	Cypress.Commands.add('declareWinner', () => {
		cy.get('#result').then(($result) => {
			cy.findWidth('#p1-score').then(function(value) {
				if (value >= 100) {
					expect($result.text()).to.equal('Player-1 won!');
				}
			});
			cy.findWidth('#p2-score').then(function(value) {
				if (value >= 100) {
					expect($result.text()).to.equal('Player-2 won!');
				}
			});
		});
	});

	it('3. Suppose player-X reached the score of 100. Then, player-Xs progress bar must change color to green.', () => {
		var genArr = Array.from({ length: 40 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			cy.get('#roll').click({ force: true });
			cy.checkWinnerColor();
			cy.get('#roll').click({ force: true });
			cy.checkWinnerColor();
			cy.get('#hold').click({ force: true });
			cy.checkWinnerColor();
		});
	});

	Cypress.Commands.add('checkWinnerColor', () => {
		cy.findWidth('#p1-score').then(function(value) {
			if (value >= 100) {
				cy.get('#p1-score').should('have.class', 'bg-success');
			}
		});
		cy.findWidth('#p2-score').then(function(value) {
			if (value >= 100) {
				cy.get('#p2-score').should('have.class', 'bg-success');
			}
		});
	});

	it('4. Suppose player-X reached the score of 100. Then, player-Xs score must be shown as "100 🎉."', () => {
		var genArr = Array.from({ length: 45 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			cy.get('#roll').click({ force: true });
			cy.checkWinnerText();
			cy.get('#roll').click({ force: true });
			cy.checkWinnerText();
			cy.get('#hold').click({ force: true });
			cy.checkWinnerText();
		});
	});

	Cypress.Commands.add('checkWinnerText', () => {
		cy.findWidth('#p1-score').then(function(value) {
			if (value >= 100) {
				cy.get('#p1-score').should('have.text', '100 🎉');
			}
		});
		cy.findWidth('#p2-score').then(function(value) {
			if (value >= 100) {
				cy.get('#p2-score').should('have.text', '100 🎉');
			}
		});
	});

	it('5. When the game ends, the "Roll" and "Hold" buttons become disabled.', () => {
		var genArr = Array.from({ length: 45 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			cy.get('#roll').click({ force: true });
			cy.get('#roll').click({ force: true });
			cy.get('#hold').click({ force: true });
		});
		cy.get('#roll').should('be.disabled');
		cy.get('#hold').should('be.disabled');
	});

	it('6. Suppose player-X rolled the die, and it landed on a value other than 1. Moreover, assume player-Xs current score plus the new (would be) turn total is greater or equal to 100. Then, the game must "press" the hold button for player-X (so the game ends, and player-X is declared the winner).', () => {
		let player;
		let add;

		let p1Hold = 0;
		let p2Hold = 0;
		let p1Score = 0;
		let p2Score = 0;

		var genArr = Array.from({ length: 90 }, (v, k) => k + 1);
		cy.wrap(genArr).each(() => {
			// check who's turn it is before roll
			cy.get('#result').then(($result) => {
				player = $result.text();

				cy.findWidth('#p1-score').then(function(value) {
					p1Score = value;
				});
				cy.findWidth('#p2-score').then(function(value) {
					p2Score = value;
				});

				cy.findWidth('#p1-hold').then(function(value) {
					p1Hold = value;
				});
				cy.findWidth('#p2-hold').then(function(value) {
					p2Hold = value;
				});

				// roll the dice and expect outcome
				cy.get('#roll').click({ force: true });
				cy.get('#die').then(($btn) => {
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

					if (add == 0) {
					} else {
						if (player.includes('Player-1')) {
							if (p1Hold + p1Score + add >= 100) {
								expect($result.text()).to.equal('Player-1 won!');
							}
						} else {
							if (p2Hold + p2Score + add >= 100) {
								expect($result.text()).to.equal('Player-2 won!');
							}
						}
						cy.get('#hold').click({ force: true });
					}
				});
			});
		});
	});
});
