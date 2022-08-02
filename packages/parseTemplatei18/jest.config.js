module.exports = {
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branch: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  moduleFileExtensions: [
    "ts",
    "js",
    "jsx",
    "tsx",
    "json",
    "node"
  ],
  testEnvironment: "node",
  transform: {
    "\\.[jt]s": "babel-jest"
  },
  verbose: true,
  coveragePathIgnorePatterns: [
    "<rootDir>/packages/parseTemplatei18"
  ],
};
