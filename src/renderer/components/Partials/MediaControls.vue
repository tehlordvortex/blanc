<template>
  <div class="media-controls" :style="computedStyle">
    <div class="media-controls-art" :style="computedImageStyle">
      <!-- <img :src="currentlyPlaying ? image : ''" /> -->
      <material-button
        icon
        flat
        @click="playing ? pause($event) : play($event)"
      >
        <i
          class="material-icons"
        >
          {{ playing ? 'pause' : 'play_arrow' }}
        </i>
      </material-button>
    </div>
    <div class="media-controls-details" ref="details">
      <div v-if="currentlyPlaying">
        <p class="media-controls-details--title">{{ currentlyPlaying.title || currentlyPlaying.fileName }}</p>
        <p class="media-controls-details--artist" v-if="currentlyPlaying.artist">{{ currentlyPlaying.artist }}</p>
        <a class="media-controls-details--album" @click.stop="gotoAlbum(currentlyPlaying.album)" v-if="currentlyPlaying.album">{{ currentlyPlaying.album }}</a>
      </div>
      <p v-else>Nothing is playing.</p>
    </div>
    <div class="media-controls-seeker">
      <material-button
        icon
        flat
        @click="playPrevious"
      >
        <i class="material-icons">skip_previous</i>
      </material-button>
      <span>{{ positionText }}</span>
      <input :style="computedStyle" type="range" min="0" :max="duration" v-model="sliderPosition" step="1" @change="seekSong"/>
      <span>{{ durationText }}</span>
      <material-button
        icon
        flat
        @click="playNext"
      >
        <i class="material-icons">skip_next</i>
      </material-button>
    </div>
    <div class="media-controls-actions">
      <!-- <i
        class="material-icons icon-button"
        tabindex="0"
        @click="playing ? pause($event) : play($event)"
        @keyup.enter="playing ? pause($event) : play($event)"
        >{{ playing ? 'pause' : 'play_arrow' }}</i> -->
      <!-- <i
        class="material-icons icon-button"
        @click="stop"
        @keyup.enter="stop"
        tabindex="0"
        >
        stop
      </i> -->
      <material-button
        icon
        flat
        @click="toggleLoop"
      >
        <i class="material-icons">{{ loopIcon }}</i>
      </material-button>
      <material-button
        icon
        flat
        @click.stop="toggleQueue"
      >
        <i
          class="material-icons"
        >
          queue_music
        </i>
      </material-button>
      <div class="media-controls-volume-slider-container">
        <material-button
          @click="showVolume = !showVolume"
          icon
          flat
        >
          <i class="material-icons">{{ this.volume > 0.5 ? 'volume_up' : 'volume_down' }}</i>
        </material-button>
        <transition
          appear
          name="animated-vertical-slide-fade"
          enter-active-class="animated fadeInLeft"
          leave-active-class="animated fadeOutLeft"
        >
          <volume-slider v-if="showVolume" class="media-controls-volume-slider" />
        </transition>
      </div>
      <material-button
        icon
        flat
        @click="goFullscreen"
      >
        <i class="material-icons">keyboard_arrow_up</i>
      </material-button>
    </div>
    <transition
      name="animated-fade-slide-in"
      enter-active-class="animated fadeInRight"
      leave-active-class="animated fadeOutRight">
      <queue v-if="showQueue" class="media-controls-queue" @close="showQueue = false" />
    </transition>
    <transition
      name="animated-zoom-in"
      enter-active-class="animated slideInUp animated-slow"
      leave-active-class="animated slideOutDown animated-slow"
    >
      <div class="media-controls-fullscreen" v-show="fullscreen" :style="computedStyle">
        <transition
          name="animated-slide-in"
          :enter-active-class="backgroundEnterActiveClass"
          :leave-active-class="backgroundLeaveActiveClass"
        >
          <div class="media-controls-fullscreen--background" :style="computedImageStyle" :key="computedImageStyle"></div>
        </transition>
        <div class="media-controls-fullscreen--leave-button">
          <material-button
            icon
            flat
            @click="leaveFullscreen"
          >
            <i class="material-icons">keyboard_arrow_down</i>
          </material-button>
        </div>
        <!-- <div class="media-controls-art media-controls-art--large" :style="computedImageStyle">
        </div> -->
        <div class="media-controls-details" @click.stop>
          <!-- <keep-alive> -->
            <av-circle
              v-if="audioElement"
              :canv-width="500"
              :canv-height="500"
              :progress="false"
              :rotate-graph="true"
              :outline-width="0"
              :bar-color="visualizerBarColor"
              canv-class="media-controls-details--background"
              :audio-element="audioElement"
              :enabled="windowFocused && fullscreen && playing"
            ></av-circle>
          <!-- </keep-alive> -->
          <div class="media-controls-details--items">
            <template v-if="currentlyPlaying">
              <p class="media-controls-details--title">{{ currentlyPlaying.title || currentlyPlaying.fileName }}</p>
              <p class="media-controls-details--artist">{{ currentlyPlaying.artist }}</p>
              <p class="media-controls-details--album">{{ currentlyPlaying.album }}</p>
            </template>
            <p v-else>Nothing is playing.</p>
            <div class="media-controls-seeker">
              <material-button
                icon
                flat
                @click="playPrevious"
              >
                <i class="material-icons">skip_previous</i>
              </material-button>
              <span>{{ positionText }}</span>
              <input @click.stop type="range" min="0" :max="duration" v-model="sliderPosition" step="1"/>
              <span>{{ durationText }}</span>
              <material-button
                icon
                flat
                @click="playNext"
              >
                <i class="material-icons">skip_next</i>
              </material-button>
            </div>
            <div class="media-controls-actions">
              <material-button
                icon
                flat
                @click="playing ? pause($event) : play($event)"
              >
                <i
                  class="material-icons"
                >
                  {{ playing ? 'pause' : 'play_arrow' }}
                </i>
              </material-button>
              <material-button
                icon
                flat
                @click="toggleLoop"
              >
                <i class="material-icons">{{ loopIcon }}</i>
              </material-button>
              <div class="media-controls-volume-slider-container">
                <material-button
                  @click="showVolume = !showVolume"
                  icon
                  flat
                >
                  <i class="material-icons">{{ this.volume > 0.5 ? 'volume_up' : 'volume_down' }}</i>
                </material-button>
                <transition
                  appear
                  name="animated-vertical-slide-fade"
                  enter-active-class="animated fadeInLeft"
                  leave-active-class="animated fadeOutLeft"
                >
                  <volume-slider v-if="showVolume" class="media-controls-volume-slider" />
                </transition>
              </div>
              <material-button
                icon
                flat
                @click.stop="showFullscreenQueue = !showFullscreenQueue"
              >
                <i
                  class="material-icons"
                  >
                  queue_music
                </i>
              </material-button>
              <material-button
                icon
                flat
                @click.stop="toggleWindowFullscreen"
              >
                <i
                class="material-icons"
                >
                  fullscreen
                </i>
              </material-button>
            </div>
          </div>
          <!-- <canvas ref="visualizer"></canvas> -->
        </div>
        <transition
          name="animated-slide-in"
          enter-active-class="animated slideInUp"
          leave-active-class="animated slideOutDown">
          <queue v-if="showFullscreenQueue" @close="showFullscreenQueue = false" class="media-controls-fullscreen-queue "/>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import settings from '@/lib/settings'
import { getColors, loadAlbumArt, getBackgroundImageCSS } from '@/lazy-loaders'
import Player from '@/lib/player'

import Queue from './Queue'
import VolumeSlider from './VolumeSlider'
import MaterialButton from './MaterialButton'
import { toFileURL } from '@/lib/utils'

import { ipcRenderer as ipc } from 'electron'

import * as Mousetrap from 'mousetrap'
import { throttle } from 'underscore'

window.appSettings = settings

export default {
  name: 'media-controls',
  data: () => ({
    previousSong: null,
    sound: null,
    position: 0,
    duration: 0,
    fullscreen: false,
    windowFullscreen: false,
    windowFocused: true,
    showQueue: false,
    showFullscreenQueue: false,
    showVolume: false,
    audioElement: null,
    notificationTag: 'blanc',
    direction: ''
  }),
  components: {
    Queue,
    VolumeSlider,
    MaterialButton
  },
  created () {
    ipc.removeAllListeners('music-play-pause')
    ipc.removeAllListeners('music-previous')
    ipc.removeAllListeners('music-next')
    ipc.on('music-play-pause', () => {
      if (this.playing) this.pause()
      else {
        this.play()
      }
    })
    ipc.on('music-previous', () => {
      this.playPrevious()
    })
    ipc.on('music-next', () => {
      this.playNext()
    })
    window.addEventListener('blur', ($e) => {
      this.windowFocused = false
    })
    window.addEventListener('focus', ($e) => {
      this.windowFocused = true
    })
  },
  mounted () {
    this.audioElement = null
    Player.destroy()
    Player.init()
    if (this.status === 'playing' && !Player.getAudio().src) this.$store.commit('STOP_MUSIC')
    Player.getAudio().addEventListener('timeupdate', throttle(() => {
      this.position = Player.getCurrentTime()
    }, 1000))
    Player.getAudio().addEventListener('canplaythrough', ($e) => {
      // this.duration = $e.target.duration
      // console.log(Player.play().catch(e => console.warn(e)))
    })
    Player.getAudio().addEventListener('play', ($e) => {
      if (!document.hasFocus()) {
        Notification.requestPermission()
          .then(() => loadAlbumArt(this.currentlyPlaying.filePath))
          .then((path) => {
            if (path === 'file:///' || path === 'file://' || !path) path = 'static/albumart-placeholder.png'
            let body = this.currentlyPlaying.artist || 'Unknown Artist'
            body += '\n'
            body += this.currentlyPlaying.album || 'Unknown Album'
            /* eslint-disable no-new */
            this.notificationTag = (new Notification(this.currentlyPlaying.title, {
              icon: path,
              body: body,
              silent: true,
              tag: this.notificationTag
            })).tag
          })
      }
    })
    Player.getAudio().addEventListener('ended', ($e) => {
      if (this.loop === 'one') this.play()
      else if (this.loop === 'all') this.playNext()
      else this.stop()
    })
    this.audioElement = Player.getAudio()
    Mousetrap.bind('space', () => {
      if (this.playing) this.pause()
      else this.play()
    })
    Mousetrap.bind('e', () => {
      if (this.fullscreen) this.leaveFullscreen()
      else this.goFullscreen()
    })
    Mousetrap.bind(['command+e', 'ctrl+e'], () => {
      if (!this.fullscreen) this.goFullscreen()
      if (!this.windowFullscreen) this.toggleWindowFullscreen()
    })
    Mousetrap.bind(['esc'], () => {
      if (this.fullscreen) this.leaveFullscreen()
      if (this.windowFullscreen) this.toggleWindowFullscreen()
    })
    Mousetrap.bind('p', () => {
      this.playPrevious()
    })
    Mousetrap.bind('n', () => {
      this.playNext()
    })
    Mousetrap.bind('r', () => {
      this.toggleLoop()
    })
  },
  computed: {
    ...mapState({
      currentlyPlaying: state => state.Music.currentlyPlaying,
      status: state => state.Music.status,
      volume: state => state.Music.volume,
      loop: state => state.Music.loop,
      queue: state => state.Music.queue,
      currentlyPlayingIndex: state => state.Music.currentlyPlayingIndex
    }),
    sliderPosition: {
      set (newVal) {
        Player.seek(newVal)
      },
      get () {
        return this.position
      }
    },
    playing () {
      return this.status === 'playing'
    },
    durationText () {
      return this.toHHMMSS(this.duration)
    },
    positionText () {
      return this.toHHMMSS(this.position)
    },
    loopIcon () {
      switch (this.loop) {
        case 'all':
          return 'repeat'
        case 'one':
          return 'repeat_one'
        case 'none':
          return 'arrow_forward'
      }
    },
    visualizerBarColor () {
      if (this.computedStyle) {
        return ['#FFF', this.computedStyle.background]
      } else {
        return ['#333', '#666']
      }
    },
    backgroundEnterActiveClass () {
      if (this.direction === 'previous') {
        return 'animated slideInLeft'
      } else {
        return 'animated slideInRight'
      }
    },
    backgroundLeaveActiveClass () {
      if (this.direction === 'previous') {
        return 'animated slideOutRight'
      } else {
        return 'animated slideOutLeft'
      }
    }
  },
  asyncComputed: {
    image () {
      if (!this.currentlyPlaying) return Promise.resolve('')
      else {
        // console.log(this.currentlyPlaying.filePath)
        // console.log(this.currentlyPlaying.albumArt)
        // if (this.currentlyPlaying.albumArt) return Promise.resolve(toFileURL(this.currentlyPlaying.albumArt))
        return loadAlbumArt(this.currentlyPlaying.filePath)
      }
    },
    computedImageStyle () {
      // console.log(this.image)
      // if (!this.image) return Promise.resolve('')
      // console.log(this.image)
      return Promise.resolve(getBackgroundImageCSS(this.image))
    },
    computedStyle () {
      // console.log(this.image)
      if (!this.colors) return Promise.resolve('')
      else {
        // if (!this.showArt) return this.defaultActiveStyle
        return {
          background: this.colors.background,
          color: this.colors.foreground
        }
      }
    },
    colors () {
      if (this.currentlyPlaying) {
        if (this.currentlyPlaying.colors) return this.currentlyPlaying.colors
        else if (this.currentlyPlaying.albumArt) return getColors(this.currentlyPlaying.albumArt)
        else return loadAlbumArt(this.currentlyPlaying.filePath).then(path => getColors(path))
      } else {
        return Promise.resolve('')
      }
    }
  },
  watch: {
    status (newVal) {
      if (newVal === 'playing') {
        this.play()
      } else if (newVal === 'paused') {
        this.pause()
      } else if (newVal === 'stopped') {
        this.stop()
      }
    },
    currentlyPlaying (newVal) {
      if (newVal) {
        if (this.playing) this.play()
      } else {
        this.stop()
      }
    },
    volume (val) {
      Player.setVolume(val)
    }
  },
  methods: {
    toHHMMSS (string) {
      var secNum = parseInt(string, 10) // don't forget the second param
      var hours = Math.floor(secNum / 3600)
      var minutes = Math.floor((secNum - (hours * 3600)) / 60)
      var seconds = secNum - (hours * 3600) - (minutes * 60)

      if (hours < 10) hours = '0' + hours
      if (minutes < 10) minutes = '0' + minutes
      if (seconds < 10) seconds = '0' + seconds
      return (hours !== '00' ? hours + ':' : '') + minutes + ':' + seconds
    },
    createSound (source, loop = true) {
      // source = source.replace(/%/g, '%25').replace(/#/g, '%23').replace(/\?/g, '%3f')
      // source = 'file://' + source
      Player.setSrc(toFileURL(source))
      Player.play().catch(e => console.warn(e))
    },
    play (event) {
      if (!this.currentlyPlaying && !(this.currentlyPlayingIndex && this.queue.length > 0 && this.currentlyPlayingIndex <= this.queue.length - 1)) {
        return
      }
      if (event) {
        this.$store.commit('RESUME_MUSIC')
        return
      }
      if (this.currentlyPlayingIndex && this.queue.length > 0 && this.currentlyPlayingIndex <= this.queue.length - 1) {
        this.$store.commit('PLAY_MUSIC', this.queue[this.currentlyPlayingIndex])
      }
      if (!this.previousSong) {
        this.previousSong = JSON.parse(JSON.stringify(this.currentlyPlaying))
        this.duration = this.currentlyPlaying.duration
        this.createSound(this.currentlyPlaying.filePath)
      } else {
        if (this.previousSong.filePath === this.currentlyPlaying.filePath) {
          this.$store.commit('RESUME_MUSIC')
          Player.play().catch(e => console.warn(e))
        } else {
          this.previousSong = JSON.parse(JSON.stringify(this.currentlyPlaying))
          Player.stop().then(() => {
            this.duration = this.currentlyPlaying.duration
            this.createSound(this.currentlyPlaying.filePath)
          }).catch(e => console.warn(e))
        }
      }
    },
    pause (event) {
      this.$store.commit('PAUSE_MUSIC')
      Player.pause()
    },
    stop (event) {
      this.$store.commit('STOP_MUSIC')
      this.sliderPosition = 0
      this.duration = 0
      Player.stop()
    },
    seekSong (e) {
      console.log(e.target.value)
    },
    goFullscreen () {
      this.fullscreen = true
      this.$store.commit('HIDE_CHROME')
    },
    leaveFullscreen () {
      this.fullscreen = false
      if (this.windowFullscreen) this.toggleWindowFullscreen()
      this.$store.commit('SHOW_CHROME')
    },
    gotoAlbum (album) {
      this.$router.push({
        name: 'library-album-page',
        params: {
          album
        }
      })
    },
    visualizationStep () {
      requestAnimationFrame(this.visualizationStep)
      // update data in frequencyData
      this.analyser.getByteFrequencyData(this.frequencyData)
      console.log(this.frequencyData)
      // render frame based on values in frequencyData
      // console.log(frequencyData)
    },
    toggleWindowFullscreen () {
      if (!document.webkitFullscreenElement) {
        this.windowFullscreen = true
        document.documentElement.webkitRequestFullscreen()
      } else {
        this.windowFullscreen = false
        document.webkitExitFullscreen()
      }
    },
    toggleQueue () {
      this.showQueue = !this.showQueue
    },
    playPrevious () {
      this.direction = 'previous'
      this.$store.commit('PLAY_PREVIOUS_SONG', true)
    },
    playNext () {
      this.direction = 'next'
      this.$store.commit('PLAY_NEXT_SONG', true)
    },
    toggleLoop () {
      switch (this.loop) {
        case 'all':
          this.$store.commit('SET_LOOP', 'one')
          break
        case 'one':
          this.$store.commit('SET_LOOP', 'none')
          break
        case 'none':
          this.$store.commit('SET_LOOP', 'all')
          break
        default:
          // wut
          console.warn('Invalid loop state', this.loop)
          this.$store.commit('SET_LOOP', 'none')
      }
    }
  },
  beforeDestroy () {
    Player.destroy()
    this.$store.commit('STOP_MUSIC')
  }
}
</script>

<style>
  .media-controls {
    height: 70px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #222;
    color: white;
    padding: 3px 1em;
    display: flex;
    flex-direction: row;
    transition: background-color 0.3s;
    box-shadow: 0 -3px 5px 0 rgba(0, 0, 0, 0.2);
    z-index: 900;
    user-select: none;
  }
  .bottom-right {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .media-controls-art {
    width: 64px;
    background-size: cover;
    background-position: center;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .media-controls-art .icon-button {
    visibility: hidden;
  }
  .media-controls-art:hover .icon-button {
    visibility: visible;
  }

  .media-controls-art.media-controls-art--large {
    width: 256px;
    height: 256px;
  }
  .media-controls-details {
    width: 250px;
    margin-left: 1em;
    /* font-size: 0.8em; */
    margin-right: 1em; 
    color: white;
    position: relative;
  }

  @media screen and (max-width: 700px) {
    .media-controls-details {
      width: 150px;
    }
  }
  .media-controls-details--title {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .media-controls-details--title, .media-controls-details--artist, .media-controls-details--album {
    margin: 1px 0;
    color: inherit;
    text-decoration: none;
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: block;
    /* padding: 1px; */
  }

  .media-controls-details--album {
    cursor: pointer;
  }

  /* .media-controls-details p {
    margin: 0;
  } */
  .media-controls-volume-slider-container {
    position: relative;
  }
  .media-controls-volume-slider {
    position: absolute;
    left: -105px;
    top: 0;
  }
  .media-controls-seeker {
    flex-grow: 1;
    display: flex;
    align-items: center;
    color: white;
  }
  .media-controls-seeker input[type="range"] {
    width: 100%;
  }
  input[type=range] {
    -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
    width: 100%; /* Specific width is required for Firefox. */
    background: transparent; /* Otherwise white in Chrome */
  }

  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 1px solid #000000;
    height: 16px;
    width: 16px;
    border: none;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
    margin-top: -7px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
    border-radius: 50%;
    /* box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; Add cool effects to your sliders! */
    -webkit-app-region: no-drag;
  }

  input[type=range]:focus {
    outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
  }
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    /* box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; */
    background: white;
    border-radius: 1px;
    /* border: 0.2px solid #010101; */
    transition: box-shadow 0.3s;
    -webkit-app-region: no-drag;
  }
  input[type=range]:focus::-webkit-slider-runnable-track,
  input[type=range]:hover::-webkit-slider-runnable-track,
  input[type=range]:hover::-webkit-slider-thumb,
  input[type=range]:focus::-webkit-slider-thumb {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.9), 0 -1px 5px rgba(0, 0, 0, 0.9);
    /* border: 1px solid black; */
  }

  .media-controls-actions {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* .icon-button {
    background-color: transparent;
    color: white;
    border: none;
    transition: background-color 0.3s;
    border-radius: 50%;
    cursor: pointer;
    padding: 3px;
    user-select: none;
  }

  .icon-button:hover {
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
  } */
  .media-controls-fullscreen {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    /* filter: blur(3px); */
    z-index: 2001;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: black;
    background: #222;
    -webkit-app-region: drag;
    transition: all 0.5s;
  }
  .media-controls-queue {
    position: absolute;
    right: 0;
    bottom: 70px;
    max-width: 400px;
    z-index: 1000;
  }
  .media-controls-fullscreen-queue {
    position: absolute;
    left: calc(50% - 200px);
    /* transform: translateX(-50%); */
    bottom: 0;
    width: 400px;
  }
  .media-controls-fullscreen .media-controls-actions .icon-button:focus {
    outline: none;
  }
  .media-controls-fullscreen * {
    z-index: 2003;
    flex-grow: 0;
  }
  .media-controls-fullscreen .media-controls-details {
    width: 500px;
    height: 500px;
    background-color: transparent;
    color: white;
    padding: 0;
    margin: 0;
  }
  .media-controls-details--background {
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .media-controls-details--items {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.3);
    width: 350px;
    height: 350px;
    border-radius: 50%;
    /* height: 100%; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    -webkit-app-region: no-drag;
  }
  .media-controls-fullscreen .media-controls-details p {
    margin: 5px auto;
    max-width: 85%;
  }
  .media-controls-fullscreen .media-controls-seeker {
    min-width: 80%;
  }
  .media-controls-fullscreen--background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: blur(15px);
    background-position: center;
    background-size: cover;
    /* z-index: 1001; */
    /* cursor: pointer; */
  }
  .vertical-slide-fade-enter-active {
    transition: all .5s ease;
  }
  .vertical-slide-fade-leave-active {
    transition: all .5s ease;
  }
  .vertical-slide-fade-enter, .vertical-slide-fade-leave-to {
    transform: translateY(-10px);
  }
  .vertical-slide-fade-enter-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateY(0px);
    opacity: 1;
  }

  .media-controls-fullscreen .full-width {
    width: 100%;
  }

  .media-controls-fullscreen--leave-button {
    position: absolute;
    right: 0;
    top: 0;
  }

  .animated-slow {
    animation-duration: 1s;
  }
</style>
