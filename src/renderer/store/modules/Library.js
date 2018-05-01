const state = {
  indexProgress: 0,
  indexing: false
}

const mutations = {
  BEGIN_INDEXING (state) {
    state.indexProgress = 0
    state.indexing = true
  },
  FINISH_INDEXING (state) {
    state.indexing = false
  },
  UPDATE_INDEXING_PROGRESS (state, report) {
    state.indexProgress = report.processed / report.total
  }
}

const actions = {
  indexPath ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  mutations,
  actions
}
