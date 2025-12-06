describe("Audio Preview page functionality", () => {
  beforeEach(() => {
    cy.signIn();
    cy.visit("pages/dashboard");
    cy.contains(/\.(mp3|wav|flac)$/i).click();
    cy.url().should("include", "/pages/audio-preview");
  });

  function waitForAudioReady() {
    cy.get("audio")
      .should("exist")
      .then(($audio) => {
        const audio = $audio[0] as HTMLAudioElement;
        if (audio.readyState < 2) {
          cy.wrap(
            new Promise((resolve) => {
              audio.addEventListener("canplay", resolve, { once: true });
            })
          );
        }
      });
  }

  function verifyAudioPlaying() {
    cy.get("audio").should(($audio) => {
      const audio = $audio[0] as HTMLAudioElement;
      expect(audio.paused).to.be.false;
      expect(audio.currentTime).to.be.greaterThan(0);
    });
  }

  function clickPlayButton() {
    cy.get('[name="play-pause-button"]').should("be.visible").click({ force: true });
  }

  it("Should display audio waveform and controls", () => {
    cy.get('[name="waveform-container"]').should("be.visible");
    cy.get('[id="audio-controls"]').should("be.visible");
  });

  it("should play audio in waveform view", () => {
    waitForAudioReady();
    clickPlayButton();
    cy.wait(2000);
    verifyAudioPlaying();
  });

  it("should toggle between waveform and visualiser views", () => {
    cy.get('[name="waveform-container"]').should("be.visible");
    cy.get('[name="flip"]').click();
    cy.get('[id="visualiser"]').should("be.visible");
  });

  it("should play audio in visualizer view", () => {
    cy.get('[name="flip"]').click();
    cy.get('[id="visualiser"]').should("be.visible");

    waitForAudioReady();
    clickPlayButton();
    cy.wait(2000);
    verifyAudioPlaying();
  });

  it("should pause audio when play button is clicked again", () => {
    waitForAudioReady();
    clickPlayButton();
    cy.wait(1000);

    clickPlayButton();

    cy.get("audio").should(($audio) => {
      const audio = $audio[0] as HTMLAudioElement;
      expect(audio.paused).to.be.true;
    });
  });
});
