import { defineConfig } from "cypress"

export default defineConfig({
  projectId: "1",
  e2e: {
    baseUrl: process.env.CYPRESS_baseUrl ?? "http://localhost:3000",
    specPattern: "cypress/tests/**/*.cy.ts",
    supportFile: false,
    experimentalRunAllSpecs: true,
  },
})
