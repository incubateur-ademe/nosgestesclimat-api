context("GET /rules", () => {
  it("GET /latest/fr/FR/rules", () => {
    cy.request("GET", "/latest/fr/FR/rules").then((response) => {
      expect(response.status).to.eq(200)
      expect(Object.keys(response.body)).length.to.be.greaterThan(1)
    })
  })
  it("GET /latest/fr/FR/optim-rules", () => {
    cy.request("GET", "/latest/fr/FR/optim-rules").then((response) => {
      expect(response.status).to.eq(200)
      expect(Object.keys(response.body)).length.to.be.greaterThan(1)
    })
  })
  it("GET /latest/en/FR/optim-rules", () => {
    cy.request("GET", "/latest/en/FR/optim-rules").then((response) => {
      expect(response.status).to.eq(200)
      expect(Object.keys(response.body)).length.to.be.greaterThan(1)
    })
  })
})
