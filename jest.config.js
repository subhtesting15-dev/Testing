/**
 * Jest configuration for the rewards program application
 */

export default {
  // Test environment
  testEnvironment: 'node',
  
  // Enable ES modules
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  
  // Module file extensions
  moduleFileExtensions: ['js', 'json'],
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/coverage/'
  ],
  
  // Transform configuration for ES modules
  transform: {},
  
  // Setup files
  setupFilesAfterEnv: [],
  
  // Test timeout
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true
};