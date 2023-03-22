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

    //it.only executa só o selecionado
    it('preenche os campos obrigatórios e envia o formulário', function() {

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
        // cy.get('#phone-checkbox').click() //torna campo telefone obrigatorio
        cy.get('#phone-checkbox').check() 
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

    it('seleciona um produto (YouTube) por seu texto', function () {
        cy.get('#product').select('YouTube') // Seleção pelo texto
        cy.get('#product').should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function () {
        cy.get('#product').select('mentoria') // Seleção pelo value
        cy.get('#product').should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function () {
        cy.get('#product').select(1) // Seleção pelo indice
        cy.get('#product').should('have.value', 'blog')
    })
    
    it('seleciona um produto aleatorio no dropdown', () => {
        cy.get('select option').its('length' , { log: false }).then(n => { //Selecao aleatoria
                cy.get('select').select(Cypress._.random(n-1))
            })
    })

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function ($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type="checkbox"]') //pega todos os checkbox da page
            .check()
            .should('be.checked')
            .last() //seleciona o ultimo para desmarcar
            .uncheck()
            .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value') // o campo deve estar vazio
            .selectFile('./cypress/fixtures/example.json')
            .should( function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' } )
            .should( function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
        })

    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
            .selectFile('@sampleFile')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

})