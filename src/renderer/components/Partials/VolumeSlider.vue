<template>
  <div class="volume-slider" :style="computedStyle">
    <div class="volume-slider-slider">
      <input type="range" v-model="sliderVolume" min="0" max="1" step="0.1" />
    </div>
    <span class="volume-slider--arrow"></span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getColors, loadAlbumArt } from '@/lazy-loaders'
export default {
  name: 'volume-slider',
  data: () => ({
    timeout: null
  }),
  computed: {
    sliderVolume: {
      get () {
        return this.$store.state.Music.volume
      },
      set (val) {
        if (this.timeout) clearTimeout(this.timeout)
        // throttle to every 150ms
        this.timeout = setTimeout(() => this.$store.commit('CHANGE_VOLUME', val), 150)
      }
    },
    ...mapState({
      currentlyPlaying: state => state.Music.currentlyPlaying
    })
  },
  asyncComputed: {
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
  .volume-slider {
    width: 100px;
    height: 2em;
    /* transform: rotate(-90deg); */
    background-color: #333;
    /* box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5), 0 -2px 5px 0 rgba(0, 0, 0, 0.5); */
    filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.5)) drop-shadow(-3px 0 3px rgba(0, 0, 0, 0.5));
    z-index: 2;
  }
  .volume-slider-slider {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
  }
  .volume-slider--arrow {
    position: absolute;
    width: 16px;
    height: 16px;
    content: '';
    transform: rotate(45deg);
    right: -8px;
    top: 8px;
    z-index: -1;
    /* background-color: #333; */
    background-color: inherit;
    /* filter: drop-shadow(0 3px 0px rgba(0, 0, 0, 0.5)) drop-shadow(-3px 0 0 rgba(0, 0, 0, 0.5)); */
    /* box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5); */
    z-index: -1;
  }

  .volume-slider input[type=range] {
    -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
    width: 100%; /* Specific width is required for Firefox. */
    background: transparent; /* Otherwise white in Chrome */
  }

  .volume-slider input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 1px solid #000000;
    height: 16px;
    width: 16px;
    border: none;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
    margin-top: -6px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
    border-radius: 50%;
    /* box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; Add cool effects to your sliders! */
  }

  .volume-slider input[type=range]:focus {
    outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
  }
  .volume-slider input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    /* box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; */
    background: white;
    border-radius: 1px;
    /* border: 0.2px solid #010101; */
    transition: box-shadow 0.3s;
  }
  .volume-slider input[type=range]:focus::-webkit-slider-runnable-track,
  .volume-slider input[type=range]:hover::-webkit-slider-runnable-track,
  .volume-slider input[type=range]:hover::-webkit-slider-thumb,
  .volume-slider input[type=range]:focus::-webkit-slider-thumb {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.9), 0 -1px 5px rgba(0, 0, 0, 0.9);
    /* border: 1px solid black; */
  }
</style>
