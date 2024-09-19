// Header.test.tsx
import { render, screen } from "@testing-library/react";
import Header from "@/app/components/Header";
import "@testing-library/jest-dom";

// Mock dữ liệu categories
jest.mock("@/utils/constants", () => ({
  categories: [
    { id: "1", name: "Category 1", slug: "category-1" },
    { id: "2", name: "Category 2", slug: "category-2" },
  ],
}));

// Mock Appbar component
jest.mock("@/app/components/Appbar", () => () => <div>Appbar Component</div>);

describe("Header Component", () => {
  test("renders the logo with a link to home", () => {
    render(<Header />);
    const logoLink = screen.getByText(/EAGLE EYE/i);
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
  });

  test("renders search input field", () => {
    render(<Header />);
    const searchInput = screen.getByPlaceholderText(/Search Some/i);
    expect(searchInput).toBeInTheDocument();
  });

  test("renders category links", () => {
    render(<Header />);
    const category1Link = screen.getByText(
      (content, element) =>
        content.startsWith("Category 1") &&
        element?.tagName.toLowerCase() === "a"
    );
    const category2Link = screen.getByText(
      (content, element) =>
        content.startsWith("Category 2") &&
        element?.tagName.toLowerCase() === "a"
    );
    expect(category1Link).toBeInTheDocument();
    expect(category2Link).toBeInTheDocument();
  });

  test("renders Appbar component", () => {
    render(<Header />);
    const appbar = screen.getByText(/Appbar Component/i);
    expect(appbar).toBeInTheDocument();
  });
});
