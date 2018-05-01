<template>
  <div class="wrapper">
    <sweet-modal
      modal-theme="dark"
      overlay-theme="dark"
      blocking
      hide-close-button
      icon="warning"
      ref="modal"
    >
      <h1>There are no files in your library!</h1>
      <material-button to="/settings/library" slot="button">Manage Library</material-button>
    </sweet-modal>
    <!-- <div class="item-row">
      <span class="item-row--title">Albums</span>
      <div class="item-row--content" v-if="albums"> -->
    <loading-indicator v-if="loading" />
    <transition
      mode="out-in"
      @enter="entering"
      @leave="leaving"
      >
      <router-view />
    </transition>
  </div>
</template>

<script>
// import AlbumArt from '@/components/Partials/AlbumArt'
import MaterialButton from '@/components/Partials/MaterialButton'
import LoadingIndicator from '@/components/Partials/LoadingIndicator'
import db from '@/library.db'

// import { getAlbumArt } from '@/lazy-loaders'
window.db = db

export default {
  name: 'library-landing-page',
  data: () => ({
    loading: false
  }),
  watch: {
    library (newVal) {
      console.log(newVal)
      if (newVal != null && newVal === 0) {
        console.log(this.$refs)
        this.$refs.modal.open()
      }
    }
  },
  asyncComputed: {
    library () {
      return db.count({})
    }
  },
  components: {
    MaterialButton,
    LoadingIndicator
  },
  methods: {
    entering (el) {
      console.log('enter')
      this.loading = false
    },
    leaving (el) {
      console.log('leave')
      this.loading = true
    }
  }
}
</script>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #333;
  }
</style>
