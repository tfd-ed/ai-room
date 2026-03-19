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
    },
    // Enable client-side page transition caching
    keepalive: true,
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
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'km'
    }
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
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/rooms/gradient-descent',
        '/en',
        '/en/rooms/gradient-descent',
      ],
    },
    // Cache static assets and API responses
    routeRules: {
      // Static pages - cache for 1 day, revalidate in background
      '/': { isr: 3600, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
      '/en': { isr: 3600, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
      '/rooms/**': { isr: 3600, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
      '/en/rooms/**': { isr: 3600, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
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