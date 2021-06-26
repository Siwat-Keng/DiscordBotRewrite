module.exports = {
    env: {
        browser: false,
        es6: true,
        node: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    'globals': {
        'jest': true,
    },
    rules: {
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        indent: ['error', 4],
        eqeqeq: 'error',
        'no-multi-spaces': ['error'],
        'no-useless-escape': 'error',
        'comma-dangle': ['error', 'always-multiline'],
    },
}
