describe("Navigate to Premium Page", () => {
  it("should navigate to /pay when clicking on Explore Premium link", () => {
    cy.visit("/");

    cy.contains("a", "Explore Premium").click();

    cy.url().should("include", "/pay");
    cy.contains("button", "View all plans").click();
  });
});
