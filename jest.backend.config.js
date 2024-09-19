const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  testMatch: ["**/__tests__/backend/**/*.test.(ts|tsx)"],
};

module.exports = createJestConfig(customJestConfig);
