import colors from 'vuetify/es5/util/colors'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - ocean-nuxt-amplify',
    title: 'ocean-nuxt-amplify',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  /*
   ** Customize the progress bar color
   */
  loading: { color: '#3B8070' },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/main.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/apexcharts.js', mode: 'client' },
    { src: '~/plugins/amplify.js', mode: 'client' },
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios', 'nuxt-i18n'],

  router: {
    extendRoutes(routes) {
      const indexRoute = routes.findIndex((route) => route.name === 'index')
      routes[indexRoute].name = 'home'
    },
  },

  // i18n module configuration
  i18n: {
    // Options
    lazy: true,
    locales: [
      {
        code: 'en',
        file: 'en.js',
        name: 'english',
      },
      {
        code: 'es',
        file: 'es.js',
        name: 'spanish',
      },
      {
        code: 'fr',
        file: 'fr.js',
        name: 'french',
      },
      {
        code: 'de',
        file: 'de.js',
        name: 'german',
      },
      {
        code: 'it',
        file: 'it.js',
        name: 'italian',
      },
    ],
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    defaultAssets: { font: false, icons: false },
    treeShake: true,
    // customVariables: ['~/assets/variables.scss'],
    // theme: {
    //   dark: true,
    //   themes: {
    //     dark: {
    //       primary: colors.blue.darken2,
    //       accent: colors.grey.darken3,
    //       secondary: colors.amber.darken3,
    //       info: colors.teal.lighten1,
    //       warning: colors.amber.base,
    //       error: colors.deepOrange.accent4,
    //       success: colors.green.accent3,
    //     },
    //   },
    // },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    /*
     ** Run ESLint on save
     */
    // transpile: ['vue-apexcharts'],
    // extend(config, { isDev, isClient }) {
    //   if (isDev && isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/,
    //     })
    //   }
    // },
  },
}
