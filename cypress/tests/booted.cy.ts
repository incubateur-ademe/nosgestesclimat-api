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
      expect(response.body).to.contain("nightly")
    })
  })

  it("GET /latest", () => {
    cy.request("GET", "/latest").then((response) => {
      expect(response.status).to.eq(200)
      const keys = Object.keys(response.body)
      expect(keys).to.contain("languages")
      expect(keys).to.contain("regions")
      expect(keys).to.contain("version")
    })
  })

  it("GET /nightly", () => {
    cy.request("GET", "/latest").then((response) => {
      expect(response.status).to.eq(200)
      const keys = Object.keys(response.body)
      expect(keys).to.contain("languages")
      expect(keys).to.contain("regions")
      expect(keys).to.contain("version")
    })
  })
})
