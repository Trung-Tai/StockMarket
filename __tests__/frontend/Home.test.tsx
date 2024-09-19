import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import "@testing-library/jest-dom";

jest.mock("@/app/components/Header", () => () => <div>Header</div>);

describe("Home component", () => {
  test("renders the main heading", () => {
    render(<Home />);
    const mainHeading = screen.getByText(/The Sophisticated/i);
    expect(mainHeading).toBeInTheDocument();
  });

  test("renders the welcome text", () => {
    render(<Home />);
    const welcomeText = screen.getByText(/Welcome to EAGLE EYE/i);
    expect(welcomeText).toBeInTheDocument();
  });

  test("renders the description", () => {
    render(<Home />);
    const description = screen.getByText(
      /We are thrilled to welcome you to EAGLE EYE, the leading stock exchange offering cutting-edge and effective investment solutions./i
    );
    expect(description).toBeInTheDocument();
  });

  test("renders the image with correct alt text", () => {
    render(<Home />);
    const image = screen.getByAltText("Home Banner");
    expect(image).toBeInTheDocument();
  });

  test("renders the Header component", () => {
    render(<Home />);
    const header = screen.getByText("Header");
    expect(header).toBeInTheDocument();
  });
});
