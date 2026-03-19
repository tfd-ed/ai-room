// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    '@stefanobartoletti/nuxt-social-share',
    'nuxt-og-image',
    'motion-v/nuxt'
  ],
  // fonts: {
  //   defaults: {
  //     weights: [400, 700],
  //     styles: ['normal', 'italic'],
  //     subsets: [
  //       'khmer',
  //       'latin',
  //     ]
  //   },
  //   families: [
  //     { name: 'Inter', provider: 'google' },
  //     { name: 'Noto+Serif+Khmer', provider: 'google' },
  //   ]
  // },
  css: ['./app/assets/css/main.css', 'katex/dist/katex.min.css'],
  devtools: { enabled: true },
  compatibilityDate: "2025-07-15",
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
          defer: true
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
          defer: true
        },
        {
          src: 'https://cdn.plot.ly/plotly-2.27.0.min.js',
          defer: true
        }
      ]
    }
  },
  content: {
    build: {
      markdown: {
        remarkPlugins: {
          'remark-math': {}
        },
        rehypePlugins: {
          "rehype-katex": {}
        },
      }
    }
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'km',
    langDir: 'locales/',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'km', name: 'Khmer', file: 'km.json' }
    ]
  },
  googleFonts: {
    families: {
      'Inter': true,
      'Noto Serif Khmer': true,
    }
  },


  socialShare: {
    baseUrl: 'https://ai.tfdevs.com' // required!
    // other optional module options
  },
  site: {
    url: 'https://ai.tfdevs.com',
    name: 'AI & ML Room',
  },
  ogImage: {
    // fontSubsets: ['latin', 'khmer'],
    // fonts: [
    //   'Inter',
    //   'Noto Serif Khmer',
    // ]
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})