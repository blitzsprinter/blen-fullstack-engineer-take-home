import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./"
});

/** @type {import("ts-jest").JestConfigWithTsJest} */
const customJestConfig = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  verbose: true,
};

module.exports = createJestConfig(customJestConfig);