<template>
  <div class="media-controls" :style="computedStyle">
    <div class="media-controls-art" :style="computedImageStyle" @click="goFullscreen">
      <!-- <img :src="currentlyPlaying ? image : ''" /> -->
    </div>
    <div class="media-controls-details">
      <div v-if="currentlyPlaying">
        <p class="media-controls-details--title">{{ currentlyPlaying.title || currentlyPlaying.fileName }}</p>
        <p class="media-controls-details--artist" v-if="currentlyPlaying.artist">{{ currentlyPlaying.artist }}</p>
        <a class="media-controls-details--album" @click.stop="gotoAlbum(currentlyPlaying.album)" v-if="currentlyPlaying.album">{{ currentlyPlaying.album }}</a>
      </div>
      <p v-else>Nothing is playing.</p>
    </div>
    <div class="media-controls-seeker">
      <input type="range" min="0" :max="duration" v-model="sliderPosition" step="1" @change="seekSong"/>
    </div>
    <div class="media-controls-actions">
      <i
        class="material-icons icon-button"
        @click="playing ? pause($event) : play($event)"
        >{{ playing ? 'pause' : 'play_arrow' }}</i>
      <i
        class="material-icons icon-button"
        @click="stop"
        >
        stop
      </i>
      <settings-popup-button />
    </div>
    <transition
      name="animated-zoom-in"
      enter-active-class="animated zoomInUp"
      leave-active-class="animated zoomOutDown"
    >
      <div class="media-controls-fullscreen" v-if="fullscreen" @click="leaveFullscreen" :style="computedStyle">
        <div class="media-controls-fullscreen--background" :style="computedImageStyle"></div>
        <!-- <div class="media-controls-art media-controls-art--large" :style="computedImageStyle">
        </div> -->
        <div class="media-controls-details" @click.stop>
          <div v-if="currentlyPlaying">
            <p class="media-controls-details--title">{{ currentlyPlaying.title || currentlyPlaying.fileName }}</p>
            <p class="media-controls-details--artist">{{ currentlyPlaying.artist }}</p>
            <p class="media-controls-details--album">{{ currentlyPlaying.album }}</p>
          </div>
          <p v-else>Nothing is playing.</p>
        </div>
        <div class="media-controls-seeker">
          <input @click.stop type="range" min="0" :max="duration" v-model="sliderPosition" step="1"/>
        </div>
        <div class="media-controls-actions">
          <i
            class="material-icons icon-button"
            @click.stop="playing ? pause($event) : play($event)"
            >{{ playing ? 'pause' : 'play_arrow' }}</i>
          <i
            class="material-icons icon-button"
            @click.stop="stop"
            >
            stop
          </i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import settings from '@/lib/settings'
// import { loadAlbumArt } from '@/lazy-loaders'
// import { Howl, Howler } from 'howler'
import { loadAlbumArt, toColorString, getBackgroundImageCSS } from '@/lazy-loaders'
import Player from '@/lib/player'
// import Vibrant from 'node-vibrant'
// import Color from 'color'
// import * as fs from 'fs'
// import * as mime from 'mime'

import SettingsPopupButton from './SettingsPopupButton'

window.appSettings = settings

export default {
  name: 'media-controls',
  data: () => ({
    previousSong: null,
    sound: null,
    position: 0,
    duration: 0,
    fullscreen: false,
    ctx: null,
    source: null,
    analyser: null,
    frequencyData: null
  }),
  components: {
    SettingsPopupButton
  },
  mounted () {
    // if (Howler.usingWebAudio) {
    //   this.ctx = Howler.ctx
    // }
    if (!Player.getAudio()) Player.init()
    let seek = () => {
      this.position = Player.getCurrentTime()
      if (this.duration !== 0 && this.position >= this.duration) {
        console.log('stopping')
        this.stop()
      }
      // console.log(this.position)
      if (!Player.isPaused()) Player.nextAnimationFrame = requestAnimationFrame(seek)
    }
    Player.getAudio().addEventListener('canplaythrough', ($e) => {
      console.log('Loaded!')
      this.duration = $e.target.duration
      console.log(this.duration)
      // console.log(Player.play().catch(e => console.warn(e)))
    })
    Player.getAudio().addEventListener('play', ($e) => {
      console.log('Playing!!!')
      Player.nextAnimationFrame = requestAnimationFrame(seek)
    })
  },
  computed: {
    ...mapState({
      currentlyPlaying: state => state.Music.currentlyPlaying,
      status: state => state.Music.status
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
    }
  },
  asyncComputed: {
    image () {
      if (!this.currentlyPlaying) return Promise.resolve('')
      else {
        console.log(this.currentlyPlaying.filePath)
        return Promise.resolve(loadAlbumArt(this.currentlyPlaying.filePath))
      }
    },
    computedImageStyle () {
      // console.log(this.image)
      if (!this.image) return Promise.resolve('')
      console.log(this.image)
      return Promise.resolve(getBackgroundImageCSS(this.image))
    },
    computedStyle () {
      // console.log(this.image)
      if (!this.currentlyPlaying) return Promise.resolve('')
      if (this.currentlyPlaying.colors) return Promise.resolve(toColorString(this.currentlyPlaying.colors))
      else return Promise.resolve('')
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
      this.play()
    }
  },
  methods: {
    createSound (source, loop = true) {
      // let sound = new Howl({
      //   src: [source],
      //   autoplay: true,
      //   html5: true,
      //   loop: loop
      // })
      // sound.on('load', (id) => {
      //   if (!this.ctx && Howler.usingWebAudio) {
      //     this.ctx = Howler.ctx
      //   }
      //   if (!this.analyser) {
      //     this.analyser = this.ctx.createAnalyser()
      //   }
      //   console.log(sound._sounds[0]._node)
      //   this.duration = sound.duration(id)
      // })
      // sound.on('stop', (id) => {
      //   if (sound.nextAnimationFrame) {
      //     cancelAnimationFrame(sound.nextAnimationFrame)
      //   }
      // })
      // return sound
      source = source.replace(/%/g, '%25').replace(/#/g, '%23').replace(/\?/g, '%3f')
      source = 'file://' + source
      Player.setSrc(source)
      Player.play().catch(e => console.warn(e))
    },
    play (event) {
      if (event) {
        this.$store.commit('RESUME_MUSIC', this.currentlyPlaying)
        return
      }
      console.log(this.previousSong, this.currentlyPlaying)
      if (!this.previousSong) {
        this.previousSong = JSON.parse(JSON.stringify(this.currentlyPlaying))
        this.createSound(this.currentlyPlaying.filePath)
      } else {
        if (this.previousSong.filePath === this.currentlyPlaying.filePath) {
          Player.play().catch(e => console.warn(e))
        } else {
          this.previousSong = JSON.parse(JSON.stringify(this.currentlyPlaying))
          Player.stop().then(() => {
            this.createSound(this.currentlyPlaying.filePath)
          }).catch(e => console.warn(e))
          // fs.readFile(this.currentlyPlaying.filePath, (err, contents) => {
          //   if (err) {
          //     alert('Couldn\'t play file:' + err)
          //   } else {
          //     let dataURI = 'data:' + mime.getType(this.currentlyPlaying.filePath) + ';base64,'
          //     dataURI += contents.toString('base64')
          //     this.sound = new Howl({
          //       src: [dataURI],
          //       autoplay: true,
          //       html5: true
          //     })
          //   }
          // })
          // console.log(encodeURIComponent(this.currentlyPlaying.filePath))
        }
      }
    },
    pause (event) {
      if (this.currentlyPlaying) {
        if (event) this.$store.commit('PAUSE_MUSIC')
        Player.pause()
      }
    },
    stop (event) {
      if (this.currentlyPlaying) {
        if (event) this.$store.commit('STOP_MUSIC')
        this.sliderPosition = 0
        Player.stop()
      }
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
      this.$store.commit('SHOW_CHROME')
    },
    gotoAlbum (album) {
      console.log(this.$route, this.$router, this.$router.push, this.$router.go)
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
    transition: background-color 0.5s;
    box-shadow: 0 -3px 5px 0 rgba(0, 0, 0, 0.2);
  }
  .media-controls-art {
    width: 64px;
    background-size: cover;
    background-position: center;
    cursor: pointer;
  }

  .media-controls-art.media-controls-art--large {
    width: 256px;
    height: 256px;
  }
  .media-controls-details {
    max-width: 300px;
    margin-left: 1em;
    cursor: pointer;
    font-size: 0.8em;
  }
  .media-controls-details--title {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .media-controls-details--title, .media-controls-details--artist, .media-controls-details--album {
    margin: 1px 0;
    color: inherit;
    text-decoration: none;
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    /* padding: 1px; */
  }
  /* .media-controls-details p {
    margin: 0;
  } */
  .media-controls-seeker {
    flex-grow: 1;
    padding: 1em;
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
  }

  input[type=range]:focus {
    outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
  }
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    /* box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; */
    background: white;
    border-radius: 1px;
    /* border: 0.2px solid #010101; */
    transition: box-shadow 0.3s;
  }
  input[type=range]:focus::-webkit-slider-runnable-track,
  input[type=range]:hover::-webkit-slider-runnable-track,
  input[type=range]:hover::-webkit-slider-thumb,
  input[type=range]:focus::-webkit-slider-thumb {
    box-shadow: 0 1px 5px rgba(255, 0, 0, 0.9);
    /* border: 1px solid black; */
  }
  .media-controls-actions {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-button {
    background-color: transparent;
    color: white;
    border: none;
    transition: background-color 0.3s;
    border-radius: 50%;
    cursor: pointer;
    padding: 3px;
    user-select: none;
  }

  .icon-button:hover, .icon-button:focus {
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
  }
  .media-controls-fullscreen {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    /* filter: blur(3px); */
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: black;
  }
  .media-controls-fullscreen * {
    z-index: 2003;
    flex-grow: 0;
  }
  .media-controls-fullscreen .media-controls-details {
    min-width: 300px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 0 1em;
  }
  .media-controls-fullscreen .media-controls-details p {
    margin: 10px 0;
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
    filter: blur(3px);
    background-position: center;
    background-size: cover;
    /* z-index: 1001; */
    /* cursor: pointer; */
  }
</style>
