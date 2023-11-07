context("Test basic routes", () => {
  it("GET /", () => {
    cy.request("GET", "/").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to
        .contain(`<h1 id="nosgestesclimat-api">nosgestesclimat-api</h1>
`)
    })
  })

  it("GET /versions", () => {
    cy.request("GET", "/versions").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.contain("latest")
    })
  })

  it("GET /latest", () => {
    cy.request("GET", "/latest").then((response) => {
      expect(response.status).to.eq(200)
      const keys = Object.keys(response.body)
      expect(keys).to.contain("languages")
      expect(keys).to.contain("regions")
    })
  })
})
