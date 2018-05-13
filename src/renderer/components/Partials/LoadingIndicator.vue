<template>
  <div class="loading-indicator" :class="classList">
    <Spinner :name="name" :color="colorUsed" />
  </div>
</template>

<script>
import { loadAlbumArt, getColors } from '@/lazy-loaders'
export default {
  name: 'loading-indicator',
  props: {
    name: {
      type: String,
      default: 'line-scale'
    },
    color: {
      type: String,
      default: null
    },
    fullWidth: {
      type: Boolean,
      default: true
    },
    fullHeight: {
      type: Boolean,
      default: true
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classList () {
      let c = []
      if (this.fullWidth) c.push('full-width')
      if (this.fullHeight) c.push('full-height')
      if (this.small) c.push('small')
      return c
    },
    currentlyPlaying () {
      return this.$store.state.Music.currentlyPlaying
    },
    visibleColor () {
      if (this.colors) {
        return this.colors.background
      } else {
        return ''
      }
    },
    colorUsed () {
      return this.color || this.visibleColor || '#3080ff'
    }
  },
  asyncComputed: {
    colors () {
      if (this.currentlyPlaying) {
        if (this.currentlyPlaying.colors) return this.currentlyPlaying.colors
        else if (this.currentlyPlaying.albumArt) return getColors(this.currentlyPlaying.albumArt)
        else return loadAlbumArt(this.currentlyPlaying.filePath).then(path => getColors(path))
      } else {
        return Promise.resolve('')
      }
    }
  }
}
</script>

<style>
  .loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 84px;
    width: 84px;
  }

  .loading-indicator.full-width {
    width: 100%;
  }
  .loading-indicator.full-height {
    height: 100%;
  }

  .loading-indicator.small {
    display: inline-block;
    transform: scale(0.5);
    width: unset;
    height: unset;
  }

</style>
