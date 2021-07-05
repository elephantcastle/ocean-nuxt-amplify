<template>
  <div class="middlealign enable-select">
    <h3 class="subtitle-app">{{ $t('general').enteridtext }}</h3>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="id"
        :rules="idRules"
        label="id"
        required
        outlined
      ></v-text-field>
      <v-btn class="mr-4" @click="submit"> submit </v-btn>
      <v-btn @click="clear"> clear </v-btn>
    </v-form>
  </div>
</template>

<script>
import { API } from 'aws-amplify'
import { mapMutations } from 'vuex'

export default {
  name: 'retrieve',
  data: () => ({
    valid: true,
    id: null,
    idRules: [(v) => !!v || 'Id is required'],
  }),

  methods: {
    ...mapMutations(['setGraphData', 'setId']),
    submit() {
      if (this.$refs.form.validate()) {
        API.get('oceanCalculations', `/ocean-calculations/object/${this.id}`)
          .then((response) => {
            this.setId(response.id)
            this.setGraphData(response.results)
            setTimeout(() => {
              this.$router.push({
                path: `/results`,
              })
            }, 1000)
          })
          .catch((e) => {
            console.log(e)
            this.errors.push(e)
            this.$router.push('/crashpage')
          })
      }
    },
    clear() {
      this.$refs.form.reset()
    },
  },
}
</script>