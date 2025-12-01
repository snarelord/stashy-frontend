describe("Sign Up", () => {
  beforeEach(() => {
    cy.visit("/pages/sign-up");
  });

  it("should check back button functionality", () => {
    cy.url().should("include", "/pages/sign-up");

    cy.get('[data-cy="back-button"]').click();

    cy.url().should("include", "pages/sign-in");
  });

  it("should check if passwords match", () => {
    cy.url().should("include", "pages/sign-up");

    cy.get('input[name="email"]').type(Cypress.env("signUpEmail"));
    cy.get('input[name="firstName"]').type("Brad");
    cy.get('input[name="lastName"]').type("Pitt");
    cy.get('input[name="password"]').type("thisaintpword");
    cy.get('input[name="confirmPassword"]').type("thisisnotthepassword");
    cy.get('input[name="accessCode"]').type("123456");

    cy.get('button[type="submit"]').click();
    cy.contains("Passwords do not match").should("be.visible");
  });

  it.skip("should allow a user to sign up", () => {
    cy.url().should("include", "/pages/sign-up");

    cy.get('input[name="email"]').type(Cypress.env("signUpEmail"));
    cy.get('input[name="firstName"]').type("Brad");
    cy.get('input[name="lastName"]').type("Pitt");
    cy.get('input[name="password"]').type(Cypress.env("signUpPassword"));
    cy.get('input[name="confirmPassword"]').type(Cypress.env("signUpPassword"));
    cy.get('input[name="accessCode"]').type(Cypress.env("signUpAccessCode"));

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/pages/dashboard");
  });
});
