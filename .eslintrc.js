const ERROR = 2;

module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: ['plugin:prettier/recommended', 'eslint:recommended'],
  plugins: ['babel', 'import', 'node', 'promise'],
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },
  rules: {
    quotes: [
      ERROR,
      'single',
      { avoidEscape: true, allowTemplateLiterals: true }
    ]
  },
  settings: {
    'import/resolver': {
      'babel-module': {}
    }
  }
};
