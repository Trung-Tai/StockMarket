///<reference types='cypress'/>

describe("Navigation Test", () => {
  it("should navigate to intensive data page and back to the homepage", () => {
    cy.visit("/");

    cy.url().should("include", "/");

    cy.visit("/intensive-data");

    cy.url().should("include", "/intensive-data");

    cy.get(":nth-child(1) > .text-2xl").click();

    cy.url().should("include", "/");
  });
});
