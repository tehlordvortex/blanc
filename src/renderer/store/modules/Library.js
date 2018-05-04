import { fieldCaseInsensitiveSort } from '@/lib/utils'

const state = {
  indexProgress: 0,
  indexing: false,
  refreshedAlbums: false,
  refreshedLibrary: false,
  library: null,
  albums: null
}

const mutations = {
  BEGIN_INDEXING (state) {
    state.indexProgress = 0
    state.indexing = true
  },
  FINISH_INDEXING (state) {
    state.indexing = false
    state.refreshedAlbums = true
    state.refreshedLibrary = true
  },
  UPDATE_INDEXING_PROGRESS (state, report) {
    state.indexProgress = report.processed / report.total
  },
  SET_REFRESH_ALBUMS (state) {
    state.refreshedAlbums = true
  },
  SET_REFRESH_LIBRARY (state) {
    state.refreshedLibrary = true
  },
  CLEAR_REFRESH_ALBUMS (state) {
    state.refreshedAlbums = false
  },
  CLEAR_REFRESH_LIBRARY (state) {
    state.refreshedLibrary = false
  },
  UPDATE_LIBRARY (state, libs) {
    state.library = libs
  },
  UPDATE_ALBUMS (state, albums) {
    state.albums = albums.sort(fieldCaseInsensitiveSort('name'))
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
