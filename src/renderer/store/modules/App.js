const state = {
  showChrome: true,
  showMusicBar: true,
  routeHistory: [],
  devMode: false
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
  },
  NAVIGATE_TO (state, route) {
    state.routeHistory.push(route)
  },
  NAVIGATE_BACK (state) {
    state.routeHistory.pop()
  },
  NAVIGATE_REPLACE (state, route) {
    state.routeHistory[Math.max(0, state.routeHistory.length - 1)] = route
  },
  ENABLE_DEV_MODE (state) {
    state.devMode = true
  },
  DISABLE_DEV_MODE (state) {
    state.devMode = false
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
