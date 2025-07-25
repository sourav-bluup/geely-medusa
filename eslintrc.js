module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'prettier',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true, // Enable JSX for React
    },
  },
  settings: {
    react: {
      version: 'detect', // Automatically detects the React version
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 'off', // Not needed for React 17+ with Vite
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Optional
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
  },
};
