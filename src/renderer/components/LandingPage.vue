<template>
  <div id="wrapper">
    <div class="side purple" ref="sideOne" :class="indexing || doneIndexing ? 'side--flatten' : ''">
      <transition 
        appear
        name="slide-fade"
        >
        <h1 v-if="!indexing">Welcome to Blanc</h1>
      </transition>
    </div>
    <transition
      name="side-fill"
    >
      <div class="side black" ref="sideTwo" v-if="showFirstStart" :class="indexing || doneIndexing ? 'side--fill' : showFirstStart ? '' : 'side--flatten'">
        <transition
          mode="out-in"
          name="slide-fade"
          >
          <div class="flex-center" v-if="!(indexing || doneIndexing)" key="index-input">
            <input type="text" v-model="libraryPath" id="library-path">
            <input type="submit" value="Continue" id="continue-button" @click="startIndexing">
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
              @afterEnter="leavePage"
            >
              <div class="loader" key="loader" v-if="!doneIndexing"></div>
              <div class="done-icon" key="done-icon" v-else></div>
            </transition>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import IndexerWorker from '@/indexer.worker'
  import db from '@/library.db'
  window.db = db
  const userPath = ipcRenderer.sendSync('sync-get-path', 'music')
  const defLibraryPath = userPath || ''
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
    created () {
      this.$store.commit('HIDE_CHROME')
      db.find({}).limit(2).exec((err, res) => {
        if (res && res.length > 0) {
          this.leavePage(true)
        } else {
          this.showFirstStart = true
        }
        if (err) {
          console.log(err)
        }
      })
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      startIndexing () {
        // this.$refs.sideOne.classList.toggle('side--flatten')
        this.indexing = !this.indexing
        if (!this.worker) {
          this.worker = new IndexerWorker()
          this.worker.onmessage = (e) => {
            if (e.data) {
              if (e.data.command === 'add-item') {
                db.insert(e.data.item)
              } else if (e.data.command === 'finish-indexing') {
                this.indexing = false
                this.doneIndexing = true
              } else if (e.data.command === 'add-items') {
                e.data.items.forEach(item => {
                  db.update({ filePath: item.filePath }, item, { upsert: true })
                })
              } else if (e.data.command === 'currently-indexing') {
                this.currentPath = e.data.path
              }
            }
          }
        }
        this.worker.postMessage({
          command: 'index',
          path: this.libraryPath
        })
        // this.$refs.sideTwo.classList.toggle('side--fill')
      },
      leavePage: function (immediate) {
        if (!immediate) {
          setTimeout(() => {
            this.$store.commit('SHOW_CHROME')
            this.$router.push({
              name: 'library-landing-page'
            })
          }, 500)
        } else {
          this.$store.commit('SHOW_CHROME')
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
  .side {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 1 auto;
    justify-content: center;
    transition: opacity 0.5s ease, width 0.5s ease;
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s ease;
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
  #library-path {
    height: 2em;
    border: 1px solid grey;
    border-radius: 3px;
    width: 90%;
    padding: 0 5px;
    margin: 1em 0;
  }
  input {
    transition: box-shadow 0.3s;
  }
  input:hover, input:focus {
    box-shadow: 0 0 3px 2px rgba(40, 130, 255, 0.3);
    outline: none !important;
  }
  #continue-button {
    display: inline-block;
    padding: 1em;
    background-color: #8000ff;
    border: none;
    cursor: pointer;
    color: white;
    font-weight: bold;
    font-family: 'Courier New', Courier, monospace;
  }
  #continue-button:hover, #continue-button:focus {
    box-shadow: 0 0 3px 1px #8000ff;
  }
  .loader {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 4px solid #666;
    border-top-color: #8000ff;
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
    background-color: #00FF30;
    position: relative;
  }
  .done-icon::after {
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
  }
</style>
