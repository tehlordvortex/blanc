<template>
  <div id="wrapper">
    <div class="side blue" ref="sideOne" :class="indexing || doneIndexing ? 'side--flatten' : ''">
      <transition
        appear
        mode="out-in"
        name="slide-fade"
        >
        <img src="static/icon.png" class="icon" key="icon" v-if="!indexing"/>
      </transition>
      <transition
        appear
        mode="out-in"
        name="slide-fade"
        >
        <h1 key="text" v-if="!indexing">blanc</h1>
      </transition>
    </div>
    <transition
      name="side-fill"
    >
      <div class="side black" ref="sideTwo" v-if="showFirstStart" :class="indexing || doneIndexing ? 'side--fill' : showFirstStart ? '' : 'side--flatten'">
        <transition
          appear
          mode="out-in"
          name="slide-fade"
          >
          <div class="flex-center" v-if="!(indexing || doneIndexing)" key="index-input">
            <h2>Drag and drop, or select a folder</h2>
            <div id="input-path">
              <input
                @drop.stop.prevent="dropPath" 
                @dragenter.stop.prevent
                @dragover.stop.prevent="dragOver"
                type="text"
                v-model="libraryPath"
                id="library-path">
              <button @click="choosePath" id="select-button">
                <i class="material-icons">folder</i>
              </button>
            </div>
            <button type="submit" id="continue-button" @click="startIndexing">
              <span>continue</span> <i class="material-icons">arrow_forward</i>
            </button>
            <!-- <div class="done-icon"></div> -->
          </div>
          <div class="flex-center" v-else key="index-status">
            <transition
              mode="out-in"
              name="animated-fade"
              enter-active-class="animated fadeIn animated--fast"
              leave-active-class="animated fadeOut animated--fast"
            >
              <h1 :key="doneIndexing">{{ doneIndexing ? 'All set!' : 'Indexing music...' }}</h1>
            </transition>
            <p v-if="indexing">{{ currentPath }}</p>
            <transition
              mode="out-in"
              name="animated-slide"
              enter-active-class="animated slideInUp animated--fast"
              leave-active-class="animated slideOutDown animated--fast"              
            >
              <progress-bar 
                barColor="#3050ff"
                class="near-fill" :val="indexPercent" key="loader" v-if="!doneIndexing"
                ></progress-bar>
              <div class="done-icon" key="done-icon" v-else>
                <i class="material-icons">done</i>
              </div>
            </transition>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
  import { ipcRenderer, remote } from 'electron'
  // import IndexerWorker from '@/indexer.worker'
  // import { loadAlbumArt, computedStyle } from '@/lazy-loaders'
  import db from '@/library.db'
  import settings from '@/lib/settings'
  import ProgressBar from 'vue-simple-progress'
  import { getLibrary, getAlbums } from '@/lazy-loaders'
  import { addFiles, default as index } from '@/indexer.lib'
  import { mapState } from 'vuex'
  const app = remote.app
  window.db = db
  const defLibraryPath = app.getPath('music') || ''
  export default {
    name: 'landing-page',
    data: () => ({
      indexing: false,
      libraryPath: defLibraryPath,
      worker: null,
      currentPath: '',
      doneIndexing: false,
      showFirstStart: false
    }),
    components: {
      ProgressBar
    },
    computed: mapState({
      indexPercent: state => state.Library.indexProgress * 100,
      library: state => state.Library.library,
      albums: state => state.Library.albums
    }),
    watch: {
      doneIndexing (value) {
        if (value) this.leavePage(false)
      }
    },
    created () {
      this.$store.commit('HIDE_CHROME')
      this.$store.commit('HIDE_MUSIC_BAR')
      if (settings.libraries.length === 0) this.showFirstStart = true
      else {
        if (!this.library || typeof this.library[0] !== 'string' || !this.albums) {
          getLibrary().then(() => {
            return getAlbums()
          }).then(() => {
            Promise.all(settings.libraries.map(library => addFiles(library))).then(() => this.leavePage())
          })
        } else {
          Promise.all(settings.libraries.map(library => addFiles(library))).then(() => this.leavePage())
        }
      }
    },
    methods: {
      dragOver (event) {
      },
      dropPath (event) {
        console.log(event)
        let items = event.dataTransfer.files
        this.libraryPath = items[0].path
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      choosePath () {
        ipcRenderer.once('dialog-selected-folder', (event, path) => {
          this.libraryPath = path || this.libraryPath
        })
        ipcRenderer.send('dialog-select-folder', this.libraryPath)
      },
      startIndexing () {
        // this.$refs.sideOne.classList.toggle('side--flatten')
        this.indexing = !this.indexing
        index(this.libraryPath).then(() => {
          settings.addLibrary(this.libraryPath)
          this.indexing = false
          this.doneIndexing = true
        }).catch(e => {
          console.log(e)
        })
      },
      leavePage: function (immediate) {
        console.log('leavePage')
        if (!immediate) {
          setTimeout(() => {
            this.$store.commit('SHOW_CHROME')
            this.$store.commit('SHOW_MUSIC_BAR')
            this.$router.push({
              name: 'library-landing-page'
            })
          }, 2000)
        } else {
          this.$store.commit('SHOW_CHROME')
          this.$store.commit('SHOW_MUSIC_BAR')
          this.$router.push({
            name: 'library-landing-page'
          })
        }
      }
    }
  }
</script>

<style scoped>
  #wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    position: relative;
    font-family: 'Courier New', Courier, monospace;
  }
  .flex-center {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .near-fill {
    width: 90%;
    margin: 0 auto;
  }
  .icon {
    width: 128px;
    height: 128px;
    margin: 0;
  }
  .side {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 1 auto;
    justify-content: center;
    transition: width 0.2s ease;
  }
  .slide-fade-enter-active {
    transition: all .5s ease;
  }
  .slide-fade-leave-active {
    transition: all .5s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  .side.side--flatten {
    z-index: -1;
    width: 0px;
  }
  .side-fill-enter {
    width: 0;
  }
  .side-fill-to {
    width: 50%;
  }
  .side.side--fill {
    z-index: 2;
    width: 100%;
  }
  .side.black {
    background-color: #333;
    color: white;
  }
  .side.purple {
    background: #8000ff;
    color: white;
  }
  .side.blue {
    background: #3050ff;
    color: white;
    animation: change-bg 10s linear alternate infinite forwards;
  }
  @keyframes change-bg {
    0% {
      background: #3050ff;
    }
    100% {
      background: #8000ff;
    }
  }
  #library-path {
    height: 2em;
    border: none;
    width: 90%;
    padding: 0 5px;
    margin: 0;
  }
  #select-button {
    display: inline-block;
    padding: 0;
    height: 2em;
    width: 10%;
    background-color: #3050ff;
    border: none;
    cursor: pointer;
    color: white;
    font-weight: bold;
    font-family: 'Courier New', Courier, monospace;
    transition: box-shadow 0.3s;
  }
  #input-path {
    width: 90%;
    display: flex;
    margin: 1em 0;
    transition: box-shadow 0.3s;
  }
  input {
    transition: box-shadow 0.3s;
  }
  input:focus, button:focus {
    outline: none !important;
  }
  #input-path:hover, #input-path:focus {
    box-shadow: 0 0 3px 2px rgba(40, 130, 255, 0.3);
  }
  #continue-button {
    display: inline-block;
    padding: 1em;
    background-color: #3050ff;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    color: white;
    font-weight: bold;
    font-family: 'Courier New', Courier, monospace;
    transition: box-shadow 0.3s;
  }
  #continue-button span {
    float: left;
    line-height: 24px;
  }
  #continue-button .material-icons {
    float: left;
    width: 24px;
    height: 24px;
    margin-left: 5px;
  }
  #continue-button:hover, #continue-button:focus {
    box-shadow: 0 0 3px 1px #3050ff;
  }
  .loader {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 4px solid #666;
    border-top-color: #3050ff;
    animation: rotate 0.3s linear infinite;
  }
  @keyframes rotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .animated--medium {
    animation-duration: 0.4s;
  }
  .animated--fast {
    animation-duration: 0.3s;
  }
  .done-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin: 1em;
    padding: 1em;
    background-color: #00FF30;
    position: relative;
  }
  .done-icon .material-icons {
    font-size: 32px;
  }
  /* .done-icon::after {
    width: 24px;
    height: 24px;
    content: '';
    border-top: 4px solid white;
    border-left: 4px solid white;
    position: absolute;
    left: 50%;
    top: 50%;
    transform-origin: center;
    transform: translate(-50%, -70%) rotate(225deg) scaleY(1.3);
  } */
</style>
