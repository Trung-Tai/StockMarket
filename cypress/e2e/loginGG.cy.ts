///<reference types='cypress'/>

describe("Google Login Test", () => {
  it("should navigate to Google sign-in page and handle mock login", () => {
    cy.intercept("POST", "/api/auth/signin/google", {
      statusCode: 200,
      body: {
        user: {
          id: "12345",
          name: "Mock User",
          email: "mockuser@example.com",
        },
        token: "mock-token",
      },
    }).as("googleSignIn");

    cy.visit("/");
    cy.contains("Sign In").click();
    cy.url().should("include", "/sign-in");
    cy.get('[data-testid="login-button"]').click();

    cy.wait("@googleSignIn").then(({ response }) => {
      expect(response).to.not.be.undefined;

      const user = response?.body?.user;

      expect(user?.name).to.eq("Mock User");
      expect(user?.email).to.eq("mockuser@example.com");
    });
  });
});
