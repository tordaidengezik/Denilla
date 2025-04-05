import { defineConfig } from 'cypress';
// Ne használd az ES6 import szintaxist
// import fileUploadPlugin from 'cypress-file-upload';

// Helyette használd a require szintaxist:
// const { attachFile } = require('cypress-file-upload');

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,ts}",
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // Ahelyett, hogy a teljes plugint használnád
      on('task', {
        // Csak a szükséges funkciókat regisztráld
        attachFile() {
          return null;
        }
      });
      return config;
    },
  },
});
