/// <reference types="Cypress" />

const faker = require ('faker'); //biblioteca de dados fake
faker.locale='pt_BR';

describe('Central de Atendimento ao Cliente TAT', () => {
    const user = {}
    const THREE_SECONDS_IN_MS = 3000

    beforeEach( () => {
        cy.visit('src/index.html')

        user.email = faker.internet.email()
        user.firstname = faker.name.firstName()
        user.lastname = faker.name.lastName()
    })

    it('verifica o título da aplicação', () => {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    //it.only executa só o selecionado
    it('preenche os campos obrigatórios e envia o formulário', () => {

        const longText= 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae nunc sed velit dignissim. Ut venenatis tellus in metus vulputate eu scelerisque felis. Turpis massa tincidunt dui ut ornare lectus sit amet est. Pretium fusce id velit ut tortor pretium viverra suspendisse. Purus sit amet luctus venenatis lectus. In cursus turpis massa tincidunt. Fermentum iaculis eu non diam phasellus vestibulum lorem sed risus. Nulla facilisi cras fermentum odio eu feugiat pretium nibh. A diam sollicitudin tempor id eu nisl nunc. Facilisi cras fermentum odio eu feugiat.'
        
        cy.clock() //congela o relogio

        cy.get('#firstName').type(user.firstname)
        cy.get('#lastName').type(user.lastname)
        cy.get('#email').type(user.email)
        //cy.get('#open-text-area').type('Teste')
        cy.get('#open-text-area').type(longText , { delay: 0 }) //delay sobrescreve o default (10) e faz o input ser instantaneo
        cy.get('button[type="submit"]').click()
        
        //verificacao de sucesso
        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS) //faz o tempo 'adiantar'
        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        
        cy.clock()
        
        cy.get('#firstName').type('Nome')
        cy.get('#lastName').type('Sobrenome')
        cy.get('#email').type('nomesobrenome@email,com') //email invalido
        cy.get('#open-text-area').type('Teste')
        cy.get('button[type="submit"]').click()
        
        //verificacao de erro
        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS) //faz o tempo 'adiantar'
        cy.get('.error').should('not.be.visible')
    })

    it('campo de telefone continua vazio se um valor não-numérico for digitado', () => {
        cy.get('#phone').type('abcdegfhi').should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        
        cy.clock()

        cy.get('#firstName').type('Nome')
        cy.get('#lastName').type('Sobrenome')
        cy.get('#email').type('nomesobrenome@email.com') 
        // cy.get('#phone-checkbox').click() //torna campo telefone obrigatorio
        cy.get('#phone-checkbox').check() 
        cy.get('#open-text-area').type('Teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS) //faz o tempo 'adiantar'
        cy.get('.error').should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Nome').should('have.value', 'Nome').clear().should('have.value', '')
        cy.get('#lastName').type('Sobrenome').should('have.value', 'Sobrenome').clear().should('have.value', '')
        cy.get('#email').type('nomesobrenome@email.com').should('have.value', 'nomesobrenome@email.com').clear().should('have.value', '')
        cy.get('#phone').type('999999999').should('have.value', '999999999').clear().should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        //cy.get('button[type="submit"]').click()

        cy.clock()

        //testando contains ao invés de get
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS) //faz o tempo 'adiantar'
        cy.get('.error').should('not.be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', () => {
        
        cy.clock()
        
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS) //faz o tempo 'adiantar'
        cy.get('.success').should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product').select('YouTube') // Seleção pelo texto
        cy.get('#product').should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product').select('mentoria') // Seleção pelo value
        cy.get('#product').should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product').select(1) // Seleção pelo indice
        cy.get('#product').should('have.value', 'blog')
    })
    
    Cypress._.times ( 5, () =>{
        it('seleciona um produto aleatorio no dropdown', () => {
            
            cy.get('select option').its('length' , { log: false }).then( n => { //Selecao aleatoria
                cy.get('select')
                    .select(Cypress._.random(1, n-1))
            })
            cy.get('#product').should('not.have.value', null)
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

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a')
            .should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target') //remove o target _blank para abrir na mesma aba
            .click()
        cy.contains('Talking About Testing')
            .should('be.visible')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', () => {
        const longText = Cypress._.repeat('0123456789', 20)

        cy.get('#open-text-area')
            .invoke('val', longText)
            .should('have.value', longText)
    })

    it('faz uma requisição HTTP', () => {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should( (response) => {
                //console.log(response)

                const { status, statusText, body} = response
                expect(status).to.equal(200)
                expect(statusText).to.equal('OK')
                expect(body).to.include('CAC TAT')
            })

    })

    it('encontra o gato escondido', () => {
        cy.get('#cat')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
    })

})