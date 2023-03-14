/// <reference types="Cypress" />

const faker = require ('faker'); //biblioteca de dados fake
faker.locale='pt_BR';

describe('Central de Atendimento ao Cliente TAT', function() {
    const user = {}

    beforeEach(function() {
        cy.visit('src/index.html')

        user.email = faker.internet.email()
        user.firstname = faker.name.firstName()
        user.lastname = faker.name.lastName()
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    
    it.only('preenche os campos obrigatórios e envia o formulário', function() {

        const longText= 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae nunc sed velit dignissim. Ut venenatis tellus in metus vulputate eu scelerisque felis. Turpis massa tincidunt dui ut ornare lectus sit amet est. Pretium fusce id velit ut tortor pretium viverra suspendisse. Purus sit amet luctus venenatis lectus. In cursus turpis massa tincidunt. Fermentum iaculis eu non diam phasellus vestibulum lorem sed risus. Nulla facilisi cras fermentum odio eu feugiat pretium nibh. A diam sollicitudin tempor id eu nisl nunc. Facilisi cras fermentum odio eu feugiat.'
        
        cy.get('#firstName').type(user.firstname)
        cy.get('#lastName').type(user.lastname)
        cy.get('#email').type(user.email)
        //cy.get('#open-text-area').type('Teste')
        cy.get('#open-text-area').type(longText , { delay: 0 }) //delay sobrescreve o default (10) e faz o input ser instantaneo
        cy.get('button[type="submit"]').click()
        
        //verificacao de sucesso
        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
        cy.get('#firstName').type('Nome')
        cy.get('#lastName').type('Sobrenome')
        cy.get('#email').type('nomesobrenome@email,com') //email invalido
        cy.get('#open-text-area').type('Teste')
        cy.get('button[type="submit"]').click()
        
        //verificacao de erro
        cy.get('.error').should('be.visible')
    })

    it('campo de telefone continua vazio se um valor não-numérico for digitado', function () {
        cy.get('#phone').type('abcdegfhi').should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function (){
        cy.get('#firstName').type('Nome')
        cy.get('#lastName').type('Sobrenome')
        cy.get('#email').type('nomesobrenome@email.com') 
        cy.get('#phone-checkbox').click() //torna campo telefone obrigatorio
        cy.get('#open-text-area').type('Teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
        cy.get('#firstName').type('Nome').should('have.value', 'Nome').clear().should('have.value', '')
        cy.get('#lastName').type('Sobrenome').should('have.value', 'Sobrenome').clear().should('have.value', '')
        cy.get('#email').type('nomesobrenome@email.com').should('have.value', 'nomesobrenome@email.com').clear().should('have.value', '')
        cy.get('#phone').type('999999999').should('have.value', '999999999').clear().should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
        //cy.get('button[type="submit"]').click()

        //testando contains ao invés de get
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function () {
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    })

  })