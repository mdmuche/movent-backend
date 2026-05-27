export default {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js", "**/tests/**/*.test.js"],
  setupFiles: ["<rootDir>/tests/setupEnv.js"],
  collectCoverageFrom: ["src/controllers/**/*.js", "src/middlewares/**/*.js"],
};
