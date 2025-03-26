export default {
  transform: {},
  extensionsToTreatAsEsm: ['.js', '.mjs'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\\.{1,2}/.*)\\.mjs$': '$1'
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'mjs']
}; 