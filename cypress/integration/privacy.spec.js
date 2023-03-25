//testando lodash pra executar o mesmo teste varias vezes

Cypress._.times( 3, () => {
    it('testa a página da política de privacidade de forma independente', () => {
        cy.visit('src/privacy.html')
    
        cy.contains('Talking About Testing')
            .should('be.visible')
    })
})