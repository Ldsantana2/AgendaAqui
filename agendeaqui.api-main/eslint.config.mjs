// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import * as safeql from '@ts-safeql/eslint-plugin';
import dotenv from 'dotenv';

dotenv.config();

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      '@ts-safeql/safeql': safeql,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@ts-safeql/check-sql': [
        'error',
        {
          connections: [
            {
              connectionUrl: process.env.DATABASE_URL,
              migrationsDir: './prisma/migrations',
              targets: [
                {
                  tag: 'prisma.+($queryRaw|$executeRaw)',
                  transform: '{type}[]',
                },
              ],
            },
          ],
        },
      ],
    },
  },
);
