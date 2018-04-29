const state = {
  showChrome: true,
  showMusicBar: true
}

const mutations = {
  HIDE_CHROME (state) {
    state.showChrome = false
  },
  SHOW_CHROME (state) {
    state.showChrome = true
  },
  HIDE_MUSIC_BAR (state) {
    state.showMusicBar = false
  },
  SHOW_MUSIC_BAR (state) {
    state.showMusicBar = true
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
