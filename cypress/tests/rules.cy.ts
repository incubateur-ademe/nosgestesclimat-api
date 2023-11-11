function assertValidRules(rules: object) {
  const keys = Object.keys(rules)
  expect(keys).length.to.be.greaterThan(1)
  expect(keys).to.contain("bilan")
  expect(keys).to.contain("logement")
  expect(keys).to.contain("divers")
  expect(keys).to.contain("alimentation")
  expect(keys).to.contain("transport")
  expect(keys).to.contain("services sociétaux")
}

context("GET /latest/rules", () => {
  it("GET /latest/fr/FR/rules", () => {
    cy.request("GET", "/latest/fr/FR/rules").then((response) => {
      expect(response.status).to.eq(200)
      assertValidRules(response.body)
    })
  })
  it("GET /latest/fr/FR/optim-rules", () => {
    cy.request("GET", "/latest/fr/FR/optim-rules").then((response) => {
      expect(response.status).to.eq(200)
      assertValidRules(response.body)
    })
  })
  it("GET /latest/en/FR/optim-rules", () => {
    cy.request("GET", "/latest/en/FR/optim-rules").then((response) => {
      expect(response.status).to.eq(200)
      assertValidRules(response.body)
    })
  })
  it("GET /latest/fr/FR/rules/bilan", () => {
    cy.request("GET", "/latest/fr/FR/rules/bilan").then((response) => {
      expect(response.status).to.eq(200)
      assert(response.body["titre"] === "Votre bilan climat personnel")
      expect(response.body).to.have.property("formule")
    })
  })
})

context("GET /nightly/rules", () => {
  it("GET /nightly/fr/FR/rules", () => {
    cy.request("GET", "/nightly/fr/FR/rules").then((response) => {
      expect(response.status).to.eq(200)
      assertValidRules(response.body)
    })
  })
  it("GET /nightly/fr/FR/optim-rules", () => {
    cy.request("GET", "/nightly/fr/FR/optim-rules").then((response) => {
      expect(response.status).to.eq(200)
      assertValidRules(response.body)
    })
  })
  it("GET /nightly/en/FR/optim-rules", () => {
    cy.request("GET", "/nightly/en/FR/optim-rules").then((response) => {
      expect(response.status).to.eq(200)
      assertValidRules(response.body)
    })
  })
  it("GET /nightly/fr/FR/rules/bilan", () => {
    cy.request("GET", "/nightly/fr/FR/rules/bilan").then((response) => {
      expect(response.status).to.eq(200)
      assert(response.body["titre"] === "Votre bilan climat personnel")
      expect(response.body).to.have.property("formule")
    })
  })
})
