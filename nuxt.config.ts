import tailwindcss from '@tailwindcss/vite'
import { virtualMembers } from './plugins/virtual-members'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@nuxt/icon',
        'shadcn-nuxt',
        '@vueuse/nuxt',
    ],

    ssr: false,
    devtools: { enabled: true },

    app: {
        head: {
            title: 'Six Nine Nine',
            charset: 'utf-8',
            meta: [
                {
                    name: 'description',
                    content: 'Six Nine Nine',
                },
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: `/logo.svg` },
            ],
        },
    },
    css: ['~/assets/css/main.css'],

    runtimeConfig: {
        public: {
            githubToken: process.env.GITHUB_TOKEN,
            githubRepo: 'https://github.com/lonewolfyx/sixninenine',
        },
    },

    compatibilityDate: '2025-08-05',

    vite: {
        plugins: [
            tailwindcss(),
            virtualMembers(),
        ],
    },

    eslint: {
        config: {
            stylistic: {
                indent: 4, // 4, or 'tab'
                quotes: 'single', // or 'double'
            },
        },
    },

    shadcn: {
        /**
         * Prefix for all the imported component
         */
        prefix: '',
        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: './app/components/ui',
    },

})
