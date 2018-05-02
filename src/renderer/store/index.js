import Vue from 'vue'
import Vuex from 'vuex'
import { VuexPersistence } from 'vuex-persist'

import modules from './modules'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  strictMode: process.env.NODE_ENV !== 'production',
  storage: localStorage,
  modules: ['Music', 'Library', 'App']
})
let store = new Vuex.Store({
  modules,
  mutations: {
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION
  },
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== 'production'
})

export default store
