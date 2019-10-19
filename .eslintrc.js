module.exports = {
  root: true,
  env: {
    node: true,
    'jest/globals': true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': [2, { code: 150, tabWidth: 2, ignoreUrls: true }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['./'],
      },
    },
  },
  plugins: [
    'jest',
  ],
};
