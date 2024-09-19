///<reference types='cypress'/>

describe("Fetch Quote API Test", () => {
  it("should fetch quote data successfully", () => {
    cy.visit("/");

    cy.url().should("include", "/");
    cy.contains("Data Vista").click();
    cy.get('[data-testid="stock-exchange-selector"]').select("HOSE");
    cy.get(":nth-child(1) > .px-8").click();
    cy.get("button.py-2.px-4.mx-1.rounded.bg-gray-600.text-white")
      .contains("3D")
      .click();
  });
});
