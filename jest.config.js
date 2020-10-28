/* eslint-disable */

/*
*  Need this set up in order to public test results and test coverage results to Azure pipelines page.
*  ref. https://github.com/joachimdalen/blog-resources/blob/master/03-tests-and-coverage/jest.config.js
*  https://joachimdalen.no/2020/10/11/code-coverage-in-azure-pipelines
*
* */
module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
/*    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },*/
    moduleNameMapper: {
        '\\.(css)$': '<rootDir>/src/__mocks__/styleMock.js'
    },
    coverageReporters: ['text', 'cobertura'],
    testResultsProcessor: 'jest-junit-reporter'
};