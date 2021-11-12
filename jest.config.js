const os = require('os')

module.exports = {
  preset: "ts-jest",
  testEnvironment: 'node',
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
  collectCoverage: true,
  coverageDirectory: os.tmpdir(),
  collectCoverageFrom: [
    "src/**/*.ts"
  ]
}
