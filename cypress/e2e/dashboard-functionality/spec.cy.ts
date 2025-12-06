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

  // it("should delete a folder", () => {
  //   cy.visit("pages/dashboard");

  //   cy.get('[name="create-folder-button"]').click();
  //   cy.get('[name="folder-input"]').type("Folder to Delete");
  //   cy.get('[name="confirm-create"]').click();
  //   cy.contains("Folder to Delete").should("exist");

  //   cy.contains("Folder to Delete").parents('[class*="tableRow"]').find('[name="delete-button"]').click();

  //   // Confirm deletion in toast
  //   cy.contains("Delete").click();

  //   // Verify folder is deleted
  //   cy.contains("Folder to Delete").should("not.exist");
  //   cy.contains("Folder deleted successfully").should("be.visible");
  // });

  // it("should delete a file", () => {
  //   cy.visit("pages/dashboard");

  //   // First upload a file to delete
  //   cy.get('[name="upload-button"]').click();
  //   cy.get('[name="file-input"]').selectFile("cypress/fixtures/example.json", { force: true });
  //   cy.contains("example.json").should("exist");

  //   cy.contains("example.json").parents('[class*="tableRow"]').find('[name="delete-button"]').click();

  //   cy.contains("Delete").click();

  //   cy.contains("example.json").should("not.exist");
  //   cy.contains("File deleted successfully").should("be.visible");
  // });

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
