describe('Denilla Automata Tesztek', () => {
  const tesztFelhasznalo = {
    email: 'profile1@gmail.com',
    jelszo: 'profile1'
  };

  const ujFelhasznalo = {
    felhasznalonev: 'ujfelhasznalo',
    email: 'uj@example.com',
    jelszo: 'ujjelszo123'
  };

  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  });

  // AT001: Sikeres bejelentkezés
  it('AT001 - Sikeres bejelentkezés', () => {
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type(tesztFelhasznalo.email)
    cy.get('[data-testid="password-input"]').type(tesztFelhasznalo.jelszo)
    cy.get('[data-testid="login-button"]').click()
    cy.url().should('include', '/foryou')
  });

  // AT002: Regisztráció
  it('AT002 - Új felhasználó regisztrációja', () => {
    cy.visit('/')
    cy.get('[data-testid="create-account-button"]').click() 
    cy.get('[data-testid="register-username"]').type(ujFelhasznalo.felhasznalonev)
    cy.get('[data-testid="register-email"]').type(ujFelhasznalo.email)
    cy.get('[data-testid="register-password"]').type(ujFelhasznalo.jelszo)
    cy.get('[data-testid="register-submit"]').click()
    cy.url().should('include', '/foryou')
  });

  // AT003: Szöveges poszt
  it('AT003 - Szöveges poszt létrehozása', () => {
    cy.bejelentkezes(ujFelhasznalo.email, ujFelhasznalo.jelszo)
    cy.get('[data-testid="create-post-button"]').click({ force: true })
    cy.get('[data-testid="post-content-input"]').type('Ez egy teszt poszt')
    cy.get('[data-testid="post-submit-button"]').click()
    cy.visit('/profile')
    cy.get('[data-testid="post-content"]').should('contain', 'Ez egy teszt poszt')
  });

  // AT004: Képes poszt
  it('AT004 - Képes poszt létrehozása', () => {
    cy.bejelentkezes(ujFelhasznalo.email, ujFelhasznalo.jelszo)
    cy.get('[data-testid="create-post-button"]').click({ force: true }) 
    cy.get('[data-testid="post-content-input"]').type('Képes poszt')
    cy.get('[data-testid="img-upload-button"]').click()
    cy.get('[data-testid="file-upload-input"]').attachFile('teszt_kep.jpg')
    cy.get('[data-testid="post-submit-button"]').click()
    cy.visit('/profile')
    cy.get('[data-testid="post-content"]').should('contain', 'Képes poszt')
  });

  // AT005: Poszt kedvelése
  it('AT005 - Poszt like-olása', () => {
    cy.bejelentkezes(ujFelhasznalo.email, ujFelhasznalo.jelszo)
    cy.get('[data-testid="like-button"]').first().click()
    cy.wait(1000)
    cy.contains('[data-testid="like-count"]', '1', { timeout: 5000 }).should('exist')
  });

  // AT006: Felhasználó követése
  it('AT006 - Felhasználó követése', () => {
    cy.bejelentkezes(ujFelhasznalo.email, ujFelhasznalo.jelszo)
    cy.viewport(1400,1000)
    cy.get('[data-testid="follow-button"]').last().click()
    cy.get('[data-testid="follow-button"]').should('contain', 'Following')
    cy.visit('/following')
    cy.get('[data-testid="post-content"]').should('exist')
  });

  // AT007: Könyvjelző
  it('AT007 - Poszt könyvjelzőzése', () => {
    cy.bejelentkezes(ujFelhasznalo.email, ujFelhasznalo.jelszo)
    cy.get('[data-testid="bookmark-button"]').first().click()
    cy.get('[data-testid="bookmark-count"]').first().should('contain', '1')
    cy.visit('/bookmarks')
    cy.get('[data-testid="post-content"]').should('exist')
  });

  // AT008: Keresés
  it('AT008 - Felhasználó keresése', () => {
    cy.bejelentkezes(ujFelhasznalo.email, ujFelhasznalo.jelszo)
    cy.visit('/search')
    cy.get('[data-testid="search-input"]').type('profile2')
    cy.get('[data-testid="search-result"]').should('contain', 'profile2')
  });

  // AT009: Értesítések
  it('AT009 - Értesítések megtekintése', () => {
    cy.bejelentkezes(tesztFelhasznalo.email, tesztFelhasznalo.jelszo)
    cy.visit('/notifications')
    cy.get('[data-testid="notification-item"]').should('have.length.gt', 0)
  });

  // AT010: Komment írása
  it('AT010 - Komment hozzáadása', () => {
    cy.bejelentkezes(ujFelhasznalo.email, ujFelhasznalo.jelszo)
    cy.get('[data-testid="post-content"]').first().click({ force: true })
    cy.wait(1000)
    cy.get('[data-testid="comment-input"]').type('Ez egy teszt komment')
    cy.get('[data-testid="submit-comment-button"]').click()
    cy.get('[data-testid="comment-content"]').should('contain', 'Ez egy teszt komment')
  });
});

// Egyéni parancsok
Cypress.Commands.add('bejelentkezes', (email, jelszo) => {
  cy.visit('/login')
  cy.get('[data-testid="email-input"]').type(email)
  cy.get('[data-testid="password-input"]').type(jelszo)
  cy.get('[data-testid="login-button"]').click()
  cy.url().should('include', '/foryou')
})
