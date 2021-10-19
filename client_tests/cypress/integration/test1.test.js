Cypress.Commands.add(
    'selectNth',
    { prevSubject: 'element' },
    (subject, pos) => {
        cy.wrap(subject)
            .children('option')
            .eq(pos)
            .then(e => {
                cy.wrap(subject).select(e.val())
            })
    }
)

describe('Rendering Tests', () => {
    it('Should render nav bar with icon,search bar, char symbol and number of item in cart.', () => {
        cy.visit('localhost:3000')
        cy.get('nav')
        cy.get('nav').find('img').parentsUntil('.icon-holder')
        cy.get('input').parentsUntil('nav')
        cy.get('nav').find('img').parentsUntil('.cart-holder')
        cy.get('nav').find('.cart-holder').find('.cart-list-length')
    });

    it('Should render filter option with correct type for checkbox and radio button.', () => {
        cy.visit('localhost:3000')
        cy.get('.filter-holder').contains(new RegExp(/gender/, 'i'))
        cy.get('.filter-holder').contains(new RegExp(/MEN/, 'i'))
        cy.get('.filter-holder').contains(new RegExp(/WOMEN/, 'i'))
        cy.get('.filter-holder').contains(new RegExp(/categories.*/, 'i'))
        cy.get('.filter-holder').contains(new RegExp(/folded.*sleeves/, 'i'))
        cy.get('.filter-holder').contains(new RegExp(/white/, 'i'))
        cy.get('.filter-holder').find('input[type=radio]').should('have.length', 2).invoke('attr', 'name').should('not.be.empty')
        cy.get('.filter-holder').find('input[type=checkbox]').should('have.length', 2)

    });

    it('Should render sort option along with all types of sorting.', () => {
        cy.visit('localhost:3000')
        cy.get('.sort-holder').find('select').find('option').should('have.length', 3)
        cy.get('.sort-holder').find('select').contains(new RegExp(/What's New/, 'i'))
        cy.get('.sort-holder').find('select').contains(new RegExp(/Better.*Discount/, 'i'))
        cy.get('.sort-holder').find('select').contains(new RegExp(/Price.*low.*to.*high/, 'i'))
    });

    it('Shoud render products in given format and enclosed in respective tags.', () => {
        cy.visit('localhost:3000')
        cy.get('.product-tile-holder').find('.indiv-tile-holder')
        cy.get('.indiv-tile-holder').contains('HERE&NOW')
        cy.get('.indiv-tile-holder').contains('Men Regular Fit Casual Shirt')
        cy.get('.indiv-tile-holder').contains(/Rs..*824/)
        cy.get('.indiv-tile-holder').first().contains(1499).then(e => {
            if (e[0].tagName !== 'STRIKE') {
                cy.get('.indiv-tile-holder').first().contains(1499).parent().then(e => {
                    expect(e[0].tagName).to.eq('STRIKE');
                })
            }
        })
        cy.get('.indiv-tile-holder').contains(/45% OFF/)
    });


    it('Should render product modal when indiv-prodcut-holder is clicked along with all the details', () => {
        cy.visit('localhost:3000')
        cy.get('.indiv-tile-holder').first().click({})
        cy.get('#product-modal').should('be.visible')
        cy.get('#product-modal').contains(new RegExp('size chart', 'i'));
        cy.get('#product-modal').contains('38')
        cy.get('#product-modal').contains('40')
        cy.get('#product-modal').contains('42')
        cy.get('#product-modal').contains('44')
        cy.get('#product-modal').contains('46')
        cy.get('#product-modal').contains('HERE&NOW')
        cy.get('#product-modal').contains('Men Regular Fit Casual Shirt')
        cy.get('#product-modal').find('img').should('have.length', 4)
        cy.get('#product-modal').contains('824')
        cy.get('#product-modal').contains('1499')
        cy.get('#product-modal').contains('45')
        cy.get('#product-modal').contains('×')
        cy.get('#product-modal').contains('Add to Cart')
    });


    it('Should render cart modal when .cart-holder is clicked along with default information', () => {
        cy.visit('localhost:3000')
        cy.get('.cart-holder').click()
        cy.get('#cart-modal-content').contains(new RegExp(/Total.*Items/, 'i'))
        cy.get('#cart-modal-content').contains(new RegExp(/Total.*Original.*Price/, 'i'))
        cy.get('#cart-modal-content').contains(new RegExp(/Total.*Discount/, 'i'))
        cy.get('#cart-modal-content').contains(new RegExp(/Final.*Price/, 'i'))
        cy.get('#cart-modal-content').contains(new RegExp(/Buy/, 'i')).then(e => {
            expect(e[0].tagName).to.eq('BUTTON');
        })
    });
});

describe('Functionality Tests', () => {

    it('Should render all the men shirt when is site is visited', () => {
        cy.visit('localhost:3000')
        cy.get('.product-tile-holder').find('.indiv-tile-holder').should('have.length', 39)
        cy.get('.product-tile-holder').find('.indiv-tile-holder').contains('Men Slim Fit Casual Shirt')
        cy.get('.product-tile-holder').find('.indiv-tile-holder').contains('Classic Fit Cotton Shirt')
    });

    it('Should render all the women shirts when is women radio button is clicked', () => {
        cy.visit('localhost:3000')
        cy.get('.filter-holder').find('input[type=radio]').then(e => {
            e[1].click()
        })
        cy.get('.product-tile-holder').find('.indiv-tile-holder').should('have.length', 33)
        cy.get('.product-tile-holder').find('.indiv-tile-holder').contains('Women Regular Fit Casual Shirt')
        cy.get('.product-tile-holder').find('.indiv-tile-holder').contains('Women Slim Fit Casual Shirt')
        cy.get('.product-tile-holder').find('.indiv-tile-holder').contains('Regular Fit Cuban Collar Shirt')
    });

    it('Should render only white shirt of selected gender when White checkbox is selected.', () => {
        cy.visit('localhost:3000')
        cy.get('.filter-holder').find('input[type=checkbox]').then(e => {
            e[0].click()
        })
        cy.get('.product-tile-holder').find('.indiv-tile-holder').should('have.length', 3)
        cy.get('.product-tile-holder').find('.indiv-tile-holder').contains('HIGHLANDER')
        cy.get('.product-tile-holder').find('.indiv-tile-holder').contains('Nautica')
        cy.get('.product-tile-holder').find('.indiv-tile-holder').contains('Men Slim Fit Casual Shirt')

        cy.visit('localhost:3000')
        cy.get('.filter-holder').find('input[type=checkbox]').then(e => {
            e[1].click()
        })
        cy.get('.filter-holder').find('input[type=radio]').then(e => {
            e[1].click()
        })
        cy.get('.product-tile-holder').find('.indiv-tile-holder').should('have.length', 15)

    });

    it('Should render only folded sleeves shirt  of selected gender when folded sleeves is selected.', () => {
        cy.visit('localhost:3000')
        cy.get('.filter-holder').find('input[type=checkbox]').then(e => {
            e[0].click()
        })
        cy.get('.product-tile-holder').find('.indiv-tile-holder').should('have.length', 3)
        cy.get('.product-tile-holder').find('.indiv-tile-holder').contains('HIGHLANDER')
        cy.get('.product-tile-holder').find('.indiv-tile-holder').contains('Nautica')
        cy.get('.product-tile-holder').find('.indiv-tile-holder').contains('Men Slim Fit Casual Shirt')
    });

    it('Should render all the correct products when checkboxes are unchecked..', () => {
        cy.visit('localhost:3000')
        cy.get('.filter-holder').find('input[type=checkbox]').then(e => {
            e[0].click()
        })
        cy.get('.filter-holder').find('input[type=checkbox]').then(e => {
            e[0].click()
        })
        cy.get('.product-tile-holder').find('.indiv-tile-holder').should('have.length', 39)

        cy.visit('localhost:3000')
        cy.get('.filter-holder').find('input[type=checkbox]').then(e => {
            e[1].click()
        })
        cy.get('.filter-holder').find('input[type=checkbox]').then(e => {
            e[1].click()
        })
        cy.get('.product-tile-holder').find('.indiv-tile-holder').should('have.length', 39)
    });

    it('Should render product by sorting order.', () => {
        cy.visit('localhost:3000')
        cy.get('.sort-holder').find('select').selectNth(2)
        cy.get('.product-tile-holder').find('.indiv-tile-holder').then(e => {
            expect(e[0].textContent).to.be.match(new RegExp('399', 'i'))
            expect(e[1].textContent).to.be.match(new RegExp('419', 'i'))
            expect(e[9].textContent).to.be.match(new RegExp('519', 'i'))
            expect(e[38].textContent).to.be.match(new RegExp('2999', 'i'))
            expect(e[35].textContent).to.be.match(new RegExp('2069', 'i'))
        })
        cy.get('.sort-holder').find('select').selectNth(1)
        cy.get('.product-tile-holder').find('.indiv-tile-holder').then(e => {
            expect(e[0].textContent).to.be.match(new RegExp('554', 'i'))
            expect(e[1].textContent).to.be.match(new RegExp('1849', 'i'))
            expect(e[10].textContent).to.be.match(new RegExp('2799', 'i'))
            expect(e[38].textContent).to.be.match(new RegExp('899', 'i'))
            expect(e[35].textContent).to.be.match(new RegExp('989', 'i'))
        })
        cy.get('.sort-holder').find('select').selectNth(0)
        cy.get('.product-tile-holder').find('.indiv-tile-holder').then(e => {
            expect(e[0].textContent).to.be.match(new RegExp('824', 'i'))
            expect(e[1].textContent).to.be.match(new RegExp('554', 'i'))
            expect(e[10].textContent).to.be.match(new RegExp('2999', 'i'))
            expect(e[38].textContent).to.be.match(new RegExp('989', 'i'))
            expect(e[35].textContent).to.be.match(new RegExp('899', 'i'))
        })

    });

    it('Should render products depending on the serach feild text.', () => {
        cy.visit('localhost:3000')
        cy.get('nav').find('input').type('HIGHlaNDER{Enter}')
        cy.get('.product-tile-holder').find('.indiv-tile-holder').should('have.length', 11)
        cy.get('nav').find('input').type('HIGHlaNDER{Enter}')
        cy.get('nav').find('input').clear()
        cy.get('nav').find('input').type('Check{Enter}')
        cy.get('.product-tile-holder').find('.indiv-tile-holder').should('have.length', 3)



    });

    it('When adding product to cart the .cart-list-length should be updated', () => {

        cy.visit('localhost:3000')

        cy.get('.indiv-tile-holder').then(e => {
            e[1].click()

            cy.get('#product-modal').contains('Add to Cart').click()
            cy.get('#product-modal').contains('×').click().then(() => {

                e[5].click()
            })

            cy.get('#product-modal').contains('Add to Cart').click()
            cy.get('#product-modal').contains('×').click().then(() => {

                e[7].click()
            })
            // e[7].click()

            cy.get('#product-modal').contains('Add to Cart').click()
            cy.get('#product-modal').contains('×').click().then(() => {

                e[12].click()
            })
            // e[12].click()

            cy.get('#product-modal').contains('Add to Cart').click()
            cy.get('#product-modal').contains('×').click().then(() => {

                e[15].click()
            })
            // e[15].click()

            cy.get('#product-modal').contains('Add to Cart').click()
            cy.get('#product-modal').contains('×').click()


        })
        cy.get('.cart-list-length').contains(5)
    });

    it('Cart should store product and display when .cart-holder is clicked', () => {
        cy.visit('localhost:3000')
        cy.get('.indiv-tile-holder').first().click()
        cy.get('#product-modal').contains('Add to Cart').click()
        cy.get('#product-modal').contains('×').click()
        cy.get('.cart-holder').click()

        // cy.get('#cart-modal-content').contains(1499/).should('have.length', 2)
        cy.get('#cart-modal-content').contains('675')
        cy.get('#cart-modal-content').contains('HERE&NOW')


        cy.visit('localhost:3000')

        cy.get('.indiv-tile-holder').then(e => {
            e[1].click()

            cy.get('#product-modal').contains('Add to Cart').click()
            cy.get('#product-modal').contains('×').click().then(() => {

                e[5].click()
            })

            cy.get('#product-modal').contains('Add to Cart').click()
            cy.get('#product-modal').contains('×').click().then(() => {

                e[7].click()
            })
            // e[7].click()

            cy.get('#product-modal').contains('Add to Cart').click()
            cy.get('#product-modal').contains('×').click().then(() => {

                e[12].click()
            })
            // e[12].click()

            cy.get('#product-modal').contains('Add to Cart').click()
            cy.get('#product-modal').contains('×').click().then(() => {

                e[15].click()
            })
            // e[15].click()

            cy.get('#product-modal').contains('Add to Cart').click()
            cy.get('#product-modal').contains('×').click()


        })
        cy.get('.cart-holder').click()
        cy.get('#cart-modal-content').contains('Dennis Lingo')
        cy.get('#cart-modal-content').contains('Men Slim Fit Casual Shirt')
        cy.get('#cart-modal-content').contains('Nautica')
        cy.get('#cart-modal-content').contains('HERE&NOW')
        cy.get('#cart-modal-content').contains('1264')
        cy.get('#cart-modal-content').contains('60%')
        cy.get('#cart-modal-content').contains('10345')
        cy.get('#cart-modal-content').contains('5530')
    });

    it('Should return correct prodcuts then combination of search string , gender(Male/Female) , categories(White,Folded) and sorting are applied.', () => {
        cy.visit('localhost:3000')
        cy.get('nav').find('input').type('fit{Enter}')
        cy.get('.filter-holder').find('input[type=radio]').then(e => {
            e[1].click()
        })
        cy.get('.filter-holder').find('input[type=checkbox]').then(e => {
            e[0].click()
        })

        cy.get('.sort-holder').find('select').selectNth(2)
        cy.get('.product-tile-holder').find('.indiv-tile-holder').then(e => {

            expect(e[0].textContent).to.be.match(new RegExp('Tokyo Talkies', 'i'))
            expect(e[1].textContent).to.be.match(new RegExp('Park Avenue', 'i'))
            expect(e[3].textContent).to.be.match(new RegExp('Berrylush', 'i'))
            expect(e[4].textContent).to.be.match(new RegExp('Kook N Keech Disney', 'i'))
            expect(e[5].textContent).to.be.match(new RegExp('Annabelle by Pantaloons', 'i'))
            expect(e[6].textContent).to.be.match(new RegExp('DOROTHY PERKINS', 'i'))


        })
    })
})
