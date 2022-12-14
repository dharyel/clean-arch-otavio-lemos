module.exports = {
    preset: '@shelf/jest-mongodb',
    roots: ['<rootDir>/src/test'],
    clearMocks: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!**/test/**',
        '!**/config/**'
    ],
    transform: {
        '.+\\.ts$': 'ts-jest'
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@test/(.*)$': '<rootDir>/src/test/$1'
    },
    setupFiles: ['dotenv/config']
}
