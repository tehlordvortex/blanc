<template>
  <div
    @click="$emit(isActive ? 'pause' : 'play', $event)"
    class="music-item-tile"
    :class="isActive ? 'music-item-tile--active' : ''"
    :style="isActive ? (computedStyle ? computedStyle : defaultActiveStyle) : ''"
    @contextmenu="$emit('contextmenu', $event)">
    <div class="music-item-tile--active-indicator">
      <loading-indicator
      :fullWidth="false"
      :fullHeight="false"
      v-if="isActive"
      :color="colors && colors.foreground || 'white'"
      small
      name="line-scale-pulse-out-rapid"
       />
    </div>
    <div class="music-item-tile--art" v-if="showArt" :style="computedImageStyle">
    </div>
    <div class="music-item-tile--details">
      <slot></slot>
    </div>
    <div class="music-item-tile--actions">
      <material-button
        icon
        flat
        :style="isActive && buttonStyle"
        @click.stop="$emit(isActive ? 'pause' : 'play', $event)"
      >
        <i class="material-icons">{{ isActive ? 'pause' : 'play_arrow' }}</i>
      </material-button>
    </div>  
  </div>
</template>

<script>
import { getColors, loadAlbumArt, getBackgroundImageCSS } from '@/lazy-loaders'
import LoadingIndicator from '@/components/Partials/LoadingIndicator'
import { toFileURL } from '@/lib/utils'
import MaterialButton from './MaterialButton'

export default {
  name: 'music-item-tile',
  data: () => ({
    defaultActiveStyle: 'background-color: #333;'
  }),
  props: {
    showArt: {
      type: Boolean,
      default: true
    },
    item: {
      type: Object,
      default: null
    },
    active: {
      type: Boolean,
      default: null
    }
  },
  asyncComputed: {
    image () {
      if (!this.showArt) return ''
      if (!this.item) return Promise.resolve('')
      if (this.item.albumArt) return Promise.resolve(toFileURL(this.item.albumArt))
      else return loadAlbumArt(this.item.filePath)
    },
    computedImageStyle () {
      // console.log(this.image)
      if (!this.image) return Promise.resolve('')
      else return getBackgroundImageCSS(this.image)
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
      if (this.item.albumArt) {
        return getColors(this.item.albumArt)
      } else {
        return loadAlbumArt(this.item.filePath).then(path => getColors(path))
      }
    },
    buttonStyle () {
      if (!this.colors) return Promise.resolve('')
      else return {color: this.colors.foreground}
    }
  },
  computed: {
    isActive () {
      if (!this.item) return false
      if (this.active !== null) return this.active
      else {
        return this.musicStatus === 'playing' && this.currentlyPlaying && this.item.filePath === this.currentlyPlaying.filePath
      }
    },
    currentlyPlaying () {
      return this.$store.state.Music.currentlyPlaying
    },
    musicStatus () {
      return this.$store.state.Music.status
    }
  },
  components: {
    LoadingIndicator,
    MaterialButton
  }
}
</script>

<style scoped>
  .music-item-tile {
    background-color: transparent;
    padding: 10px;
    display: flex;
    /* border-bottom: 1px solid grey; */
    height: 4.5em;
    color: white;
    transition: background-color 0.3s, transform 0.3s;
    cursor: pointer;
    align-items: center;
    width: 100%;
    margin: 0;
  }
  .music-item-tile--active-indicator {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
  }
  .music-item-tile--art {
    padding: 0;
    width: 64px;
    height: 64px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    flex-shrink: 0;
  }
  .music-item-tile--details {
    flex-shrink: 0;
    padding: 0;
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
  }
  .music-item-tile--details p {
    margin: 0;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .music-item-tile--actions {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    min-width: 30px;
  }
  .icon-button {
    background-color: transparent;
    /* color: white; */
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
  .music-item-tile--active {
    transform: scaleX(1.01) translateZ(1px) perspective(1px);
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
    text-rendering: optimizeLegibility;
    backface-visibility: hidden;
    -webkit-font-smoothing: subpixel-antialiased;
  }
</style>
