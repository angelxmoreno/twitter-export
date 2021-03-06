module.exports = {
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
    extraFileExtensions: ['.json'],
  },
  plugins: ['json-format', '@typescript-eslint', 'prettier'],
  rules: {
    'import/prefer-default-export': 0,
    'class-methods-use-this': 0,
    'no-nested-ternary': 0,
    'no-plusplus': 0,
    'global-require': 0,
    'no-console': 0,
    'import/no-unresolved': 0,
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'avoid',
        endOfLine: 'auto',
        printWidth: 120,
      },
    ],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'import/extensions': ['error', 'never'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
};
