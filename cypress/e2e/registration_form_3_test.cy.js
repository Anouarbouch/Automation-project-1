beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */
describe('Section 1: Visual tests', () => {
    it('Check that radio button list is correct', () => {
        cy.get('input[type="radio"]').should('have.length', 4)
        
        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never')

        //Verify default state of radio buttons
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        // Selecting one will remove selection from the other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })
    it('Country and cities dropdown is correct', () => {
        
        cy.get('#country').select(1).screenshot('country drop-down')
        cy.screenshot('Full page screenshot')
        cy.get('#country').select(2).screenshot('country drop-down')
        cy.screenshot('Full page screenshot')
        cy.get('#country').select(3).screenshot('country drop-down')
        cy.screenshot('Full page screenshot')

       
        cy.get('#country').select(1).should('have.value', 'object:3')
        cy.get('#city').find('option').eq(1).should('have.text', 'Malaga')
        cy.get('#city').find('option').eq(2).should('have.text', 'Madrid')
        cy.get('#city').find('option').eq(3).should('have.text', 'Valencia')
        cy.get('#city').find('option').eq(4).should('have.text', 'Corralejo')

        cy.get('#country').select(2).should('have.value', 'object:4')
        cy.get('#city').find('option').eq(1).should('have.text', 'Tallinn')
        cy.get('#city').find('option').eq(2).should('have.text', 'Haapsalu')
        cy.get('#city').find('option').eq(3).should('have.text', 'Tartu')
       
        cy.get('#country').select(3).should('have.value', 'object:5')
        cy.get('#city').find('option').eq(1).should('have.text', 'Vienna')
        cy.get('#city').find('option').eq(2).should('have.text', 'Salzburg')
        cy.get('#city').find('option').eq(3).should('have.text', 'Innsbruck')

        cy.get('#country').select(1,1).should('have.value', 'object:3')
        cy.get('#country').select(2).should('have.value', 'object:4')
        cy.get('#country').select(1).should('have.value', 'object:3')
        cy.get('#city').find('option').eq(1).should('not.be.selected')
    })

    it.only('Check that checkbox list is correct', () => {
        cy.get('input[type="checkbox"]').should('have.length', 2)

        //content check
        cy.get('input[type="checkbox"]').next().eq(0).should('have.text', '')
        cy.get('input[type="checkbox"]').next().eq(1).should('have.text', 'Accept our cookie policy')

        //text check
        cy.get('input[type="checkbox"]').eq(0).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('not.be.checked')
        // selection check 
        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(0).should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('be.checked')
        
        //link check
        cy.get('input[type="checkbox"]').next().eq(1).click()
    
        cy.url().should('contain', '/cookiePolicy.html')
 
        cy.go('back')
        cy.log('Back again in registration form 3')

    })
    it('Email input should support correct format', () => {
        cy.get('input[name="email"]').should('have.attr', 'ng-model', 'email')
        cy.get('input[name="email"]').type('invalid')
        cy.get('h2').contains('Birthday').click()
        cy.get('span[ng-show="myForm.email.$error.email"]').should('be.visible').should('contain', 'Invalid email address.')
        cy.get('input[type="submit"]').should('not.be.enabled')
    })

})



/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */
describe('Section 2: Functional tests', () => {

    it.only('Check that user can register with all fields filled', () => {
        cy.get('#name').type('kudo')
        cy.get('input[name="email"]').type('kudo@mail.ee')
        cy.get('#country').select(1).should('have.value', 'object:3')
        cy.get('#city').select(1)
        cy.get('input[type="date"]').eq(0).type('2020-01-01').should('have.text','2020-01-01')
        cy.get('input[type="date"]').eq(0).type('2020-01-01').should('have.text','2020-01-01')

        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="submit"]').should('not.be.disabled')
        cy.get('input[type="submit"]').click()
        cy.get('#successFrame').should('be.visible').and('contain', 'Successful registration')  
    })
    it('Check that user can register with only mandatory fields filled', () => {
        cy.get('#name').type('GTest')
        cy.get('input[name="email"]').type('email@email.com')
        cy.get('#successFrame').siblings('input[type="submit"]').should('not.be.disabled')
        cy.get('#successFrame').siblings('input[type="submit"]').click()
        cy.get('#successFrame').should('be.visible').and('contain', 'Successful registration')
 
    })
    it('Check that user cannot register without mandatory section', () => {
        
    })
   
    
    it('Check that user can add a file', () => {
    
    })