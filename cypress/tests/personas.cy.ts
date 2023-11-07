context("GET /personas", () => {
  it("GET /latest/fr/FR/personas", () => {
    cy.request("GET", "/latest/fr/FR/personas").then((response) => {
      expect(response.status).to.eq(200)
      cy.log(JSON.stringify(response.body))
      // expect(Object.keys(response.body)).length.to.be.greaterThan(1)
    })
  })
})
