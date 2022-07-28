describe('empty spec', () => {
	beforeEach(() => {
		cy.visit('https://cs280spring-classroom.github.io/the-game-of-pig-Jessie-ghub/');
	});

	// it('passes', () => {
	// 	cy.visit('https://cs280spring-classroom.github.io/the-game-of-pig-Jessie-ghub/');
	// });

	// Required

	// issue1: 'width: 0px' doesn't work
	it('player score should be zero', () => {
		cy.get('#p1-score').should('have.attr', 'style').and('include', 'width: 0%');
		cy.get('#p1-hold').should('have.attr', 'style').and('include', 'width: 0%');
		cy.get('#p2-score').should('have.attr', 'style').and('include', 'width: 0%');
		cy.get('#p2-hold').should('have.attr', 'style').and('include', 'width: 0%');
	});

	// When the game starts, it must be player-1's turn to roll the die.
	it('should be player 1 turn', () => {
		cy.contains('Player-1 turn!');
	});

	// When the game starts, the "Roll" and "Hold" buttons must be active (i.e., enabled).
	it('buttons should be clickable', () => {
		cy.get('#roll').click();
		cy.get('#hold').click();
	});

	// When the "Roll" button is clicked, the program must simulate rolling a die and reflect the outcome on the UI by updating the die face.
	it('should be player 1 turn', () => {
		cy.get('#roll').click();
		cy.get('#die').should(($btn) => {
			expect($btn.text()).to.contains.oneOf([ '⚀ ', '⚁ ', '⚂ ', '⚃ ', '⚄ ', '⚅ ' ]);
		});
	});
});
