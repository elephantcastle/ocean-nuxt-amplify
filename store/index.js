export const state = () => ({
  results: [],
  age: undefined,
  sex: undefined,
  graphData: {},
})

export const mutations = {
  updateAnswer(state, value) {
    state.results[value[0]] = value[1]
  },
  setAge(state, age) {
    state.age = age
  },
  setSex(state, sex) {
    state.sex = sex
  },
  setId(state, id) {
    state._id = id
  },
  setResults(state, results) {
    state.results = JSON.parse(JSON.stringify(results))
  },
  setGraphData(state, graphData) {
    state.graphData = graphData
  },
}

export const actions = {
  async updateResults({ commit }, value) {
    commit('setAge', value.age)
    commit('setSex', value.sex)
    commit('setId', value._id)
    await commit('setResults', value.testdata)
    await commit('setGraphData', value.graphData)
  },
}

export const getters = {
  getAge(state) {
    return state.age
  },
  getSex(state) {
    return state.sex
  },
}
