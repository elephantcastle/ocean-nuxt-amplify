<template>
  <v-container>
    <h1 class="text-center id-text">
      Save this id to retrieve this report in the future: <b>{{ _id }}</b>
    </h1>
    <apexchart
      class="primary-chart"
      :options="traitOptions"
      :series="[{ name: 'ocean-breakdown', data: traitResult }]"
    />

    <div>
      <v-container
        v-for="(trait, index) in ['O', 'C', 'E', 'A', 'N']"
        :key="index + trait"
      >
        <DescriptionCard
          class="description-card"
          :info="$t('traits')[trait]"
          :score="graphData['traits'][trait].score"
          :HML="graphData['traits'][trait].HML"
          :description="$t('description')[trait].description"
          :shortdescription="$t('description')[trait].shortdescription"
        />
      </v-container>
    </div>

    <h2 class="title-chart">Trait Breakdown</h2>
    <h4 class="title-chart">
      Each individual trait can be further breakdown in 6 major Facets
    </h4>
    <div v-for="trait in ['O', 'C', 'E', 'A', 'N']" :key="trait">
      <h3 class="title-chart">{{ $t(`traits.${trait.toUpperCase()}`) }}</h3>
      <apexchart
        class="secondary-chart"
        :options="facetOptions(trait)"
        :series="[
          {
            name: 'ocean-breakdown',
            data: facetResult([trait]),
          },
        ]"
      />

      <div v-for="i in [1, 2, 3, 4, 5, 6]" :key="i">
        <p>{{ $t(`description.${trait + i}`) }}</p>
        <p>
          Your level is:
          {{ scoretext(graphData['groupedFacets'][trait][trait + i].HML) }}
        </p>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import config from './../utils/chart-options'
import DescriptionCard from '@/components/DescriptionCard.vue'

export default {
  name: 'results',
  data() {
    return {
      options: {
        ...config,
      },
    }
  },
  components: {
    DescriptionCard,
  },
  created() {
    if (!('traits' in this.graphData) || !('groupedFacets' in this.graphData)) {
      this.$router.push('/')
    }
  },
  computed: {
    ...mapState(['graphData', '_id']),
    traitResult() {
      const traitResult = ['O', 'C', 'E', 'A', 'N'].map((trait) =>
        Math.round(this.graphData.traits[trait].score)
      )
      return traitResult
    },

    traitOptions() {
      const options = JSON.parse(JSON.stringify(this.options))
      let traits = this.$t('traits')
      options['xaxis']['categories'] = Object.values(traits).sort((a, b) =>
        'OCEAN'.indexOf(a[0]) > 'OCEAN'.indexOf(b[0]) ? 1 : -1
      )
      return options
    },
  },
  methods: {
    facetResult(trait) {
      return new Array(6)
        .fill(0)
        .map((item, index) =>
          Math.round(
            this.graphData.groupedFacets[trait][trait + (index + 1)].score
          )
        )
    },
    facetOptions(trait) {
      const options = JSON.parse(JSON.stringify(this.options))
      options['xaxis']['categories'] = new Array(6)
        .fill(0)
        .map((item, index) => trait + (index + 1))
      return options
    },
    scoretext(score) {
      if (score <= 55 && score >= 45) {
        return 'Neutral'
      }
      return (
        (score > 65 || score < 35 ? 'Very' : '') +
        ' ' +
        (score > 55 ? 'High' : 'Low')
      )
    },
  },
}
</script>

<style lang="sass" scoped>
.title-chart
  margin: 0px auto
  text-align: center

.primary-chart > div
  margin: 0 auto

.secondary-chart
  margin: 0 auto


  & > div
    margin: 0 auto

.id-text
  font-size: 18px
  margin: 0 auto
  user-select: text
</style>


