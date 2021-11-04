module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
  env: {
    browser: true,
    jest: true,
    es2020: true,
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'global-require': 'off',
    'no-restricted-imports': ['error', 'react-bootstrap'],
    'prefer-template': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'no-nested-ternary': 'off',
    'no-unused-expressions': [
      'warn',
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    'consistent-return': 'warn',
    'array-callback-return': 'off',
    'no-bitwise': 'off',
    'no-param-reassign': ['error', { props: false }],
    'prefer-destructuring': ['error', { object: true, array: false }],
    'import/no-cycle': 'warn',
    'import/no-dynamic-require': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/no-array-index-key': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/extensions': 'off',
    'import/no-unused-imports': 'off', // no-unused-vars rule is sufficient
    'import/prefer-default-export': 'off',
    'import/no-named-as-default': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'import/no-duplicates': 'warn',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        indent: 2,
        trailingComma: 'es5',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
      alias: {
        map: [['@Shared', './src/Shared/*']],
      },
    },
  },
}
