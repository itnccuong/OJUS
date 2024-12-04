/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  // globalSetup: "<rootDir>/__test__/globalSetup.ts", // Adjust the path as needed
  // globalTeardown: "<rootDir>/__test__/globalTeardown.ts", // Adjust the path as needed
};
