// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

const isDev = process.env.NODE_ENV !== 'production';

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/content',
    // '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    '@stefanobartoletti/nuxt-social-share',
    'nuxt-og-image',
    'motion-v/nuxt',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
  ],
  css: ['./app/assets/css/main.css', 'katex/dist/katex.min.css'],
  devtools: { enabled: true },
  compatibilityDate: "2024-09-19",
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
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
    },
    // Enable client-side page transition caching
    keepalive: true,
  },
  content: {
    build: {
      markdown: {
        highlight: {
          // theme: 'github-dark',
          langs: [
            'python',
            'sh',
            'vue'
          ]
        },
        remarkPlugins: {
          'remark-math': {}
        },
        rehypePlugins: {
          "rehype-katex": {},
        },
      }
    }
  },
  i18n: {
    baseUrl: 'https://ai.tfdevs.com',
    strategy: 'prefix_except_default',
    defaultLocale: 'km',
    langDir: 'locales/',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'km', name: 'Khmer', file: 'km.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'km'
    }
  },

  site: {
    url: 'https://ai.tfdevs.com',
    name: 'AI & ML Room',
  },
  // googleFonts: {
  //   families: {
  //     // 'Inter': [400, 500, 600, 700],
  //     'Google Sans': [400, 500, 600, 700, 800, 900],
  //   }
  // },

  fonts: {
    families: [
      {
        name: 'Google Sans',
        weights: [400, 500, 600, 700, 800, 900],
        global: true, provider: 'google',
        subsets: ['latin', 'khmer']
      },
    ]
  },


  socialShare: {
    baseUrl: 'https://ai.tfdevs.com' // required!
    // other optional module options
  },
  // site: {
  //   url: 'https://ai.tfdevs.com',
  //   name: 'AI & ML Room',
  // },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
      crawlLinks: true,
      routes: [
        '/',
        '/rooms/gradient-descent',
        '/en',
        '/en/rooms/gradient-descent',
      ],
    },
    // Cache static assets and API responses (ISR only in production to avoid ENOTDIR in dev)
    routeRules: {
      // Static pages - ISR + cache headers in prod; plain render in dev
      '/': isDev ? {} : { isr: 3600, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
      '/en': isDev ? {} : { isr: 3600, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
      '/rooms/**': isDev ? {} : { isr: 3600, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
      '/en/rooms/**': isDev ? {} : { isr: 3600, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
      // API - short cache
      '/api/health': { headers: { 'cache-control': 'no-store' } },
      // OG images - long cache (they rarely change)
      '/__og-image__/**': { headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' } },
      // Static assets - very long cache (fingerprinted by Vite)
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    },
    compressPublicAssets: true,
  },
  ogImage: {
    zeroRuntime: true
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