describe("Dashboard Functionality", () => {
  beforeEach(() => {
    cy.signIn();
  });

  it("should allow a user to create a folder from the dashboard", () => {
    cy.visit("pages/dashboard");
    cy.get('[name="create-folder-button"]').click();
    cy.get('[name="folder-input"]').type("Test Folder");
    cy.get('[name="confirm-create"]').click();
    cy.contains("Test Folder").should("exist");
  });

  it("upload button should upload a file from the dashboard", () => {
    cy.visit("pages/dashboard");
    cy.get('[name="upload-button"]').click();
    cy.get('[name="file-input"]').selectFile("cypress/fixtures/example.json", { force: true });
    cy.reload();
    cy.contains("example.json").should("exist");
  });

  it("clicking an audio file on dashboard should take user to audio-preview page", () => {
    cy.visit("pages/dashboard");
    cy.contains(/\.(mp3|wav|flac)$/i).click();
    cy.url().should("include", "/pages/audio-preview");
    cy.get('[name="waveform-container"]').should("be.visible");
  });

  it("create an image file should take user to image-preview page", () => {
    cy.visit("pages/dashboard");
    cy.contains(/\.(jpg|jpeg|png|svg)$/i).click();
    cy.url().should("include", "/pages/image-preview", { timeout: 10000 });
    cy.get('[class*="imageMain"]').should("be.visible");
  });
});
