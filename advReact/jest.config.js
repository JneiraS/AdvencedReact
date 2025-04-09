/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: "tsconfig.test.json"
    }],
  },
  setupFilesAfterEnv: ['jest-fetch-mock/setupJest.js'],
};