describe("Sign in", () => {
  it("should allow a user to sign in with a valid email and password", () => {
    cy.visit("pages/sign-in");

    cy.get('input[name="email"]').type(Cypress.env("signInEmail"));
    cy.get('input[name="password"]').type(Cypress.env("signInPassword"));

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/pages/dashboard");
  });
});
