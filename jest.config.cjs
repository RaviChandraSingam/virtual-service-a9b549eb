/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|sass|scss)$": "<rootDir>/src/test/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot|otf)$": "<rootDir>/src/test/__mocks__/fileMock.js",
  },
  testMatch: ["**/*.{test,spec}.{ts,tsx}"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
};
