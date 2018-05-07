<template>
  <div @click="$emit(isActive ? 'pause' : 'play', $event)" class="music-item-tile" :style="isActive ? (computedStyle ? computedStyle : defaultActiveStyle) : ''" @contextmenu="$emit('contextmenu', $event)">
    <div class="music-item-tile--active-indicator">
      <loading-indicator
      :fullWidth="false"
      :fullHeight="false"
      v-if="isActive"
      :color="this.item.colors && this.item.colors.foreground || 'white'"
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
      <i
        class="material-icons icon-button"
        @click.stop="$emit(isActive ? 'pause' : 'play', $event)"
        >{{ isActive ? 'pause' : 'play_arrow' }}</i>
    </div>
  </div>
</template>

<script>
import { loadAlbumArt, getBackgroundImageCSS } from '@/lazy-loaders'
import LoadingIndicator from '@/components/Partials/LoadingIndicator'
import { toFileURL } from '@/lib/utils'

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
      if (!this.item) return Promise.resolve('')
      if (this.item.colors) {
        return Promise.resolve({
          background: this.item.colors.background || '',
          color: this.item.colors.foreground || ''
        })
      } else {
        // if (!this.showArt) return this.defaultActiveStyle
        return Promise.resolve('')
      }
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
    LoadingIndicator
  }
}
</script>

<style scoped>
  .music-item-tile {
    background-color: #222;
    padding: 10px;
    display: flex;
    border-bottom: 1px solid grey;
    height: 4.5em;
    color: white;
    transition: background-color 0.5s;
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
</style>
