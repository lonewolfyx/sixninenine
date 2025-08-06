// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
    // Your custom configs here
    {
        rules: {
            'no-console': 'off',
            'node/prefer-global/process': 'off',
            'ts/explicit-function-return-type': 'off',
            'vue/block-order': 'off',
            'vue/valid-template-root': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'no-async-promise-executor': 'off',
            'vue/no-multiple-template-root': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
)
