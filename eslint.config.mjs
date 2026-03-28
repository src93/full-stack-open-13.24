import globals from 'globals'
import stylisticJs from '@stylistic/eslint-plugin-js'
import js from '@eslint/js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  { files: ['**/*.js']},
  { ignores: ['dist'] },
  { languageOptions: { globals: {...globals.node, ...globals.jest}, sourceType: 'module' } },
  { plugins: { '@stylistic/js': stylisticJs }, rules: {
    '@stylistic/js/indent': [
      'error',
      2
    ],
    '@stylistic/js/linebreak-style': [
      'error',
      'unix'
    ],
    '@stylistic/js/quotes': [
      'error',
      'single'
    ],
    '@stylistic/js/semi': [
      'error',
      'never'
    ],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'always'
    ],
    'arrow-spacing': [
      'error', { 'before': true, 'after': true }
    ]
  } }
]