function assertValidPersona(name: string, content: object) {
  assert(name.startsWith("persona"))
  expect(content).to.have.property("nom")
  expect(content).to.have.property("situation")
}

context("GET /latest/personas", () => {
  it("GET /latest/fr/personas", () => {
    cy.request("GET", "/latest/fr/personas").then((response) => {
      expect(response.status).to.eq(200)
      Object.entries(response.body).forEach(([name, content]) => {
        assertValidPersona(name, content)
      })
    })
  })

  it("GET /latest/en/personas", () => {
    cy.request("GET", "/latest/en/personas").then((response) => {
      expect(response.status).to.eq(200)
      Object.entries(response.body).forEach(([name, content]) => {
        assertValidPersona(name, content)
      })
    })
  })
})

context("GET /nightly/personas", () => {
  it("GET /nightly/fr/personas", () => {
    cy.request("GET", "/nightly/fr/personas").then((response) => {
      expect(response.status).to.eq(200)
      Object.entries(response.body).forEach(([name, content]) => {
        assertValidPersona(name, content)
      })
    })
  })

  it("GET /nightly/en/personas", () => {
    cy.request("GET", "/nightly/en/personas").then((response) => {
      expect(response.status).to.eq(200)
      Object.entries(response.body).forEach(([name, content]) => {
        assertValidPersona(name, content)
      })
    })
  })
})
