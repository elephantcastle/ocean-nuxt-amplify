<template>
  <v-app>
    <Header />
    <v-main>
      <Nuxt />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
export default {
  name: 'default',
  middleware: 'route-guard',
  created() {
    if (typeof window !== 'undefined') {
      const dark = localStorage.getItem('darkMode') === 'true'
      if (dark) {
        this.$vuetify.theme.dark = dark
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.$vuetify.theme.dark = true
      } else {
        this.$vuetify.theme.dark = false
      }
    }
  },
}
</script>
