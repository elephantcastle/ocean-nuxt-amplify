<template>
  <v-container>
    <v-progress-linear :value="progress" height="25" rounded color="light-blue">
      <strong>{{ Math.ceil(progress) }}%</strong>
    </v-progress-linear>
    <div v-if="index < 120">
      <v-card class="question">
        {{ $t('questions')[index] }}
      </v-card>
      <div class="answers-container">
        <v-card
          class="answers"
          v-for="(answer, i) in $t('answers')"
          :key="i"
          @click="setAnswer(i)"
        >
          {{ answer }}
        </v-card>
      </div>
    </div>
    <v-progress-circular
      class="loader"
      v-else
      :size="90"
      indeterminate
      color="primary"
    ></v-progress-circular>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { API } from 'aws-amplify'

export default {
  name: 'test',
  data() {
    return {
      index: 0,
    }
  },
  computed: {
    ...mapState(['sex', 'age', 'results']),
    progress() {
      return (this.index / this.$t('questions').length) * 100
    },
  },
  methods: {
    ...mapMutations(['updateAnswer', 'setGraphData', 'setId']),
    setAnswer(value) {
      if (this.index < 120) {
        this.updateAnswer([this.index, value + 1])
        this.index++
        if (this.index === 10) {
          this.processing = true
          const payload = {}
          payload['id'] = '0'
          payload['testdata'] = new Array(120).fill(1)
          payload['sex'] = this.sex
          payload['age'] = this.age
          payload['language'] = this.$i18n.locale

          API.post('oceanCalculations', `/ocean-calculations`, {
            body: payload,
          })
            .then((response) => {
              this.setId(response.id)
              this.setGraphData(response.graphData)
              console.log(response)
              this.$router.push({ path: `/results` })
            })
            .catch((e) => {
              console.log(e)
              this.errors.push(e)
              this.$router.push('/crashpage')
            })
        }
      }
    },
  },
}
</script>

<style>
.question {
  margin: 15px 0;
  padding: 20px;
  font-size: 30px;
  border-radius: 10px;
}
.loader {
  position: absolute;
  top: 50%;
  left: calc(50% - 41px);
}
.answers {
  margin: 20px;
  padding: 15px;
  font-size: 20px;
  border-radius: 10px;
}
@media only screen and (min-width: 600px) {
  .answers {
    margin: 20px 70px;
    padding: 15px;
    font-size: 20px;
    border-radius: 10px;
  }
}
</style>

