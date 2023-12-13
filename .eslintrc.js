module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['@typescript-eslint', 'tsdoc', 'deprecation'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'prettier',
  ],
  rules: {
    'arrow-body-style': 'off',
    'class-methods-use-this': 'off',
    curly: 'error',
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'react/function-component-definition': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-throw-literal': 'warn',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
        fixStyle: 'separate-type-imports',
      },
    ],
  },
};
