import Vue from 'vue'
const state = {
  status: 'stopped',
  queues: [],
  currentQueue: 0,
  currentlyPlayingIndex: 0,
  currentlyPlaying: null
}

const mutations = {
  PLAY_MUSIC (state, music) {
    if (!state.queues[state.currentQueue]) {
      Vue.set(state.queues, state.currentQueue, [])
    }
    state.currentlyPlaying = music
    state.currentlyPlayingIndex = state.queues[state.currentQueue].push(state.currentlyPlaying)
    state.status = 'playing'
  },
  PAUSE_MUSIC (state) {
    state.status = 'paused'
  },
  STOP_MUSIC (state) {
    state.status = 'stopped'
  },
  RESUME_MUSIC (state) {
    state.status = 'playing'
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
