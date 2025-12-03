describe("Sidebar Navigation", () => {
  beforeEach(() => {
    cy.signIn();
  });

  it("should allow a user to go to all folders", () => {
    cy.visit("pages/dashboard");

    cy.get('[name="all-folders"]').click();
    cy.url().should("include", "/pages/all-folders", { timeout: 10000 });
  });

  it("should allow a user to go back to dashboard", () => {
    cy.visit("pages/dashboard");

    cy.get('[name="dashboard"]').click();
    cy.url().should("include", "/pages/dashboard", { timeout: 10000 });
  });

  it("should allow a user to sign out", () => {
    cy.visit("pages/dashboard");

    cy.get('[name="sign-out"]').click();
    cy.get('[id="sign-in-form"]').should("be.visible");
    cy.url().should("include", "/pages/sign-in", { timeout: 10000 });
    cy.getCookie(Cypress.env("testAccountCookie")).should("not.exist");
  });
});
