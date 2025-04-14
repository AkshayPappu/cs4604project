import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next'],
    rules: {
      // Disable all TypeScript rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // Disable React rules
      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      
      // Disable Next.js rules
      '@next/next/no-page-custom-font': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
      
      // Disable general rules
      'no-unused-vars': 'off',
      'no-console': 'off',
      'no-undef': 'off',
      'no-empty': 'off',
      'no-var': 'off',
      'prefer-const': 'off',
      'no-duplicate-imports': 'off',
      'no-duplicate-case': 'off',
      'no-dupe-keys': 'off',
      'no-dupe-args': 'off',
      'no-dupe-class-members': 'off',
      'no-duplicate-imports': 'off',
      'no-extra-semi': 'off',
      'no-fallthrough': 'off',
      'no-irregular-whitespace': 'off',
      'no-mixed-spaces-and-tabs': 'off',
      'no-multi-spaces': 'off',
      'no-multiple-empty-lines': 'off',
      'no-redeclare': 'off',
      'no-regex-spaces': 'off',
      'no-sparse-arrays': 'off',
      'no-trailing-spaces': 'off',
      'no-unreachable': 'off',
      'no-unsafe-finally': 'off',
      'no-unsafe-negation': 'off',
      'no-useless-escape': 'off',
      'no-with': 'off',
      'valid-typeof': 'off',
    },
  }),
];

export default eslintConfig;
