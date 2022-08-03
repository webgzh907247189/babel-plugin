module.exports = {
  coverageDirectory: "coverage",
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
    "<rootDir>/packages/babel-remove-console"
  ],
};
