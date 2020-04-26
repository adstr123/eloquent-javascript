module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  setupFilesAfterEnv: ["<rootDir>/jest-custom-matchers.js"],
};
