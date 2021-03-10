module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['prettier', 'airbnb'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  env: { jest: true, browser: true, node: true },
  rules: { 
    'no-console': 'warn',
    'radix': 'warn',
    'no-unused-vars': 'warn',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'import/prefer-default-export': 'warn',
    'max-classes-per-file': 'warn',
    'max-len': 'warn',

    "import/extensions": [
      "warn",
      "ignorePackages",
      {
        "js": "never",
        "ts": "never",
      }
   ]
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.ts'],
      },
    },
  },
};
