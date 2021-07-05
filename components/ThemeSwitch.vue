<template>
  <div class="theme-switcher">
    <div @click="switchTheme" class="theme-switcher-icon">
      <v-icon class="dark" v-if="$vuetify.theme.dark"> </v-icon>
      <v-icon class="light" v-else> </v-icon>
      <div class="tooltip">Change theme</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThemeSwitch',
  methods: {
    switchTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem('darkMode', this.$vuetify.theme.dark)
    },
  },
}
</script>
<style lang="sass" scoped>
.theme-switcher-icon
  margin: 0 5px
  position: relative
  padding: 10px 12px
  cursor: pointer
  border-radius: 25px
  border: 1px solid transparent

  &:hover
    background-color: rgb(248, 249, 250)
    border: 1px solid #dadce0

  &:hover .tooltip
    display: flex

.tooltip
  display: none
  position: absolute
  padding: 0 0 0 3px
  background-color: lightgray
  width: 116px
  border-radius: 5px
  left: -80%
  top: 50px
</style>