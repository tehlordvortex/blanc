<template>
  <div id="app"
    @dragover.prevent
    @dragenter.prevent
    @dragleave.prevent
    @drop.prevent
    :class="showChrome ? 'pad-body' : ''"
    :style="computedStyle"
    >
    <chrome v-if="showChrome && $route.path !== '/'" />
    <navbar v-if="showChrome && $route.path !== '/'" />
    <transition
      mode="out-in"
      enter-active-class="animated slideInLeft"
      :leave-active-class="leaveClass">
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
  import Navbar from './components/Partials/Navbar'
  import { getColors, loadAlbumArt } from '@/lazy-loaders'

  export default {
    name: 'blanc',
    components: {
      Chrome,
      MediaControls,
      Navbar
    },
    data: () => ({
      leaveClass: 'animated fadeOut'
    }),
    created () {
      if (this.devMode) {
        ipc.send('open-dev-tools')
      }
    },
    computed: {
      ...mapState({
        showMusicBar: state => state.App.showMusicBar,
        showChrome: state => state.App.showChrome,
        library: state => state.Library.library,
        albums: state => state.Library.albums,
        devMode: state => state.App.devMode,
        indexPercent: state => state.Library.indexProgress * 100,
        indexing: state => state.Library.indexing,
        currentlyPlaying: state => state.Music.currentlyPlaying
      })
    },
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
      },
      indexing (value) {
        if (!value) {
          ipc.send('set-progress', -1)
        }
      },
      '$route' (value) {
        if (value.path !== '/') this.leaveClass = 'animated slideOutRight'
        else this.leaveClass = 'animated fadeOut'
      }
    },
    asyncComputed: {
      computedStyle () {
        // console.log(this.image)
        if (!this.colors) return Promise.resolve('')
        else {
          // if (!this.showArt) return this.defaultActiveStyle
          return {
            background: this.colors.background
          }
        }
      },
      colors () {
        if (this.currentlyPlaying && this.currentlyPlaying.albumArt) {
          return getColors(this.currentlyPlaying.albumArt)
        } else if (this.currentlyPlaying) {
          return loadAlbumArt(this.currentlyPlaying.filePath).then(path => getColors(path))
        } else {
          return Promise.resolve('')
        }
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
    transition: padding 0.5s, background-color 0.3s;
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
    padding-left: 50px;
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
