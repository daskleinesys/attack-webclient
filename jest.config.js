process.env.NODE_ENV = 'test';

module.exports = {
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
};
