const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  testMatch: ["**/__tests__/frontend/**/*.test.(ts|tsx)"],
};

module.exports = createJestConfig(customJestConfig);
