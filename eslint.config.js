import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],

    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'no-unused-vars': 'off',

      // TODO: Fix / re-enable these
      '@typescript-eslint/no-unused-vars': 'off',
      // '@typescript-eslint/no-unused-vars': [
      //   'error',
      //   {
      //     vars: 'all',
      //     args: 'after-used',
      //     caughtErrors: 'all',
      //     ignoreRestSiblings: false,
      //     reportUsedIgnorePattern: true,
      //     varsIgnorePattern: '^_',
      //     argsIgnorePattern: '^_',
      //     caughtErrorsIgnorePattern: '^_',
      //   },
      // ],
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/prefer-regexp-exec': 'off',
    },
  }
);
