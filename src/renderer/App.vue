<template>
  <div id="app" @dragover.prevent @dragenter.prevent @dragleave.prevent @drop.prevent :class="showChrome ? 'pad-body' : ''">
    <chrome :visible="showChrome" />
    <transition
      mode="out-in"
      enter-active-class="animated slideInLeft"
      leave-active-class="animated slideOutRight">
      <router-view></router-view>
    </transition>
    <media-controls v-if="showMusicBar" />
  </div>
</template>

<script>
  import MediaControls from './components/Partials/MediaControls'
  import Chrome from './components/Chrome'
  import { mapState } from 'vuex'
  import { ipcRenderer as ipc } from 'electron'

  export default {
    name: 'blanc',
    components: {
      Chrome,
      MediaControls
    },
    created () {
      if (this.devMode) {
        ipc.send('open-dev-tools')
      }
    },
    computed: mapState({
      showMusicBar: state => state.App.showMusicBar,
      showChrome: state => state.App.showChrome,
      library: state => state.Library.library,
      albums: state => state.Library.albums,
      devMode: state => state.App.devMode,
      indexPercent: state => state.Library.indexProgress * 100
    }),
    watch: {
      devMode (newVal) {
        if (newVal) {
          ipc.send('open-dev-tools')
        } else {
          ipc.send('close-dev-tools')
        }
      },
      indexPercent (value) {
        // avoid Math.Infinity
        if (value > 0) ipc.send('set-progress', value / 100)
        else ipc.send('set-progress', value)
      }
    }
  }
</script>

<style>
  body, html {
    height: 100%;
  }
  body {
    margin: 0;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 1em;
  }
  #app {
    width: 100%;
    height: 100%;
    background-color: #333;
    color: white;
  }
  .wrapper {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .wrapper.no-fill-height {
    height: auto;
    overflow: none;
  }
  .wrapper.no-scroll {
    overflow: hidden;
  }
  * {
    box-sizing: border-box;
  }
  .pad-body {
    padding-top: 1.5em;
    padding-bottom: 70px;
  }
  ::-webkit-scrollbar
  {
    width: 8px;  /* for vertical scrollbars */
    height: 8px; /* for horizontal scrollbars */
  }

  ::-webkit-scrollbar-track
  {
    background: rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
  }

  ::-webkit-scrollbar-thumb
  {
    background: rgba(0, 0, 0, 0.5);
    transition: all 0.3s;
  }
  .animated {
    animation-duration: 0.5s !important;
  }
  /* CSS */
</style>
