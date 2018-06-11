<template>
  <div
    @click="$emit(isActive ? 'pause' : 'play', $event)"
    :class="classList"
    :style="isActive && computedStyle"
    @contextmenu="$emit('contextmenu', $event)"
    v-observe-visibility="visibilityChanged"
    @mouseover="actionsHovered = true"
    @mouseout="actionsHovered = false"
    >
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
    <div :class="detailsClassList" v-if="item">
      <slot v-if="!this.compact"></slot>
      <template v-else>
        <span>{{ item.title }}</span>
        <span>{{ item.artist }}</span>
        <span>{{ item.album }}</span>
      </template>
    </div>
    <div
      class="music-item-tile--actions"
      :style="actionsStyle"
      v-if="item"
      >
      <material-button
        icon
        flat
        @click.stop="$emit(isActive ? 'pause' : 'play', $event)"
      >
        <i class="material-icons">{{ isActive ? 'pause' : 'play_arrow' }}</i>
      </material-button>
    </div>  
  </div>
</template>

<script>
import { getColors, loadAlbumArt, getSong } from '@/lazy-loaders'
import LoadingIndicator from '@/components/Partials/LoadingIndicator'
import MaterialButton from './MaterialButton'
import Color from 'color'
import makeColorful from '@/components/Mixins/Colorful'

export default {
  name: 'music-item-tile',
  mixins: [makeColorful(false, 'item')],
  data: () => ({
    defaultActiveStyle: 'background-color: #333;',
    visible: false,
    cachedSong: null,
    actionsHovered: false
  }),
  props: {
    showArt: {
      type: Boolean,
      default: true
    },
    compact: {
      type: Boolean,
      default: false
    },
    itemID: {
      type: String,
      default: null
    },
    itemObject: {
      type: Object,
      default: null
    },
    active: {
      type: Boolean,
      default: null
    }
  },
  asyncComputed: {
    item () {
      if (this.itemObject) return this.itemObject
      if (this.cachedSong) return this.cachedSong
      if (!this.visible) return
      return getSong(this.itemID).then(song => {
        this.cachedSong = song
        return song
      })
    },
    computedStyle () {
      // console.log(this.image)
      if (!this.colors) {
        return {
          background: this.isActive ? '#333' : ''
        }
      } else {
        // if (!this.showArt) return this.defaultActiveStyle
        return {
          background: this.colors.background,
          color: this.colors.foreground
        }
      }
    },
    colors () {
      if (this.item) {
        if (this.item.colors) return this.item.colors
        if (!this.visible) return null
        else if (this.item.albumArt) return getColors(this.item.albumArt)
        else return loadAlbumArt(this.item.filePath).then(path => getColors(path))
      } else {
        return Promise.resolve('')
      }
    }
  },
  computed: {
    isActive () {
      if (!this.item) return false
      if (this.active !== null) return this.active
      else {
        return this.musicStatus === 'playing' && this.currentlyPlaying && this.item._id === this.currentlyPlaying._id
      }
    },
    currentlyPlaying () {
      return this.$store.state.Music.currentlyPlaying
    },
    musicStatus () {
      return this.$store.state.Music.status
    },
    classList () {
      let classes = ['music-item-tile']
      if (this.compact) classes.push('music-item-tile-compact')
      if (this.isActive && !this.compact) classes.push('music-item-tile--active')
      return classes
    },
    detailsClassList () {
      let classes = ['music-item-tile--details']
      if (this.compact) classes.push('music-item-tile--details-compact')
      return classes
    },
    actionsStyle () {
      if (this.colors) {
        if (this.actionsHovered && this.isActive) {
          let color = Color(this.colors.background)
          color = color.isDark() ? color.lighten(0.3) : color.darken(0.3)
          return {
            backgroundColor: color.rgb().string()
          }
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  },
  components: {
    LoadingIndicator,
    MaterialButton
  },
  methods: {
    visibilityChanged (isVisible) {
      this.visible = isVisible
    }
  }
}
</script>

<style scoped>
  .music-item-tile {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 10px;
    display: flex;
    /* border-bottom: 1px solid grey; */
    height: 4.5em;
    transition: background-color 0.3s, transform 0.3s, color 0.3s;
    cursor: pointer;
    align-items: center;
    width: 100%;
    margin: 0;
    position: relative;
    transform: translateZ(0);
    text-rendering: optimizeLegibility;
    backface-visibility: hidden;
    -webkit-font-smoothing: subpixel-antialiased;
  }
  .music-item-tile.music-item-tile-compact {
    height: 2.3em;
    line-height: 2.3em;
    transition: background-color 0.3s, transform 0.3s, color 0.3s;
    display: flex;
    padding: 0;
  }
  .music-item-tile--active-indicator {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    display: flex;
  }
  .music-item-tile.music-item-tile-compact .music-item-tile--active-indicator {
    height: 100%;
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
    max-width: calc(100% - 42px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    flex-grow: 1;
  }
  .music-item-tile--details.music-item-tile--details-compact {
    padding: 5px;
    flex-direction: row;
  }
  .music-item-tile--details:not(.music-item-tile--details-compact) p {
    margin: 0;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .music-item-tile--details.music-item-tile--details-compact * {
    display: inline-block;
    flex: 1 1 auto;
    /* max-width: 100%; */
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: calc(100% / 3);
    white-space: nowrap;
  }

  .music-item-tile--actions {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 0;
    min-width: 30px;
    position: absolute;
    right: 0;
    background-color: #333;;
    height: 100%;
    opacity: 0;
    z-index: 10;
    transition: opacity 0.3s;
    box-shadow: 0px 0px 5px -5px rgba(0, 0, 0, 0.6);
  }
  .music-item-tile:hover .music-item-tile--actions {
    opacity: 1;
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
    transform: scaleX(1.01);
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
  }
</style>
