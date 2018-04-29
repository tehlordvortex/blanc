const state = {
  showChrome: true
}

const mutations = {
  HIDE_CHROME (state) {
    state.showChrome = false
  },
  SHOW_CHROME (state) {
    state.showChrome = true
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  mutations,
  actions
}
