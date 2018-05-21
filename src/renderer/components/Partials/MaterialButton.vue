<template>
  <router-link
    :class="classList"
    :to="this.to"
    :style="buttonColor"
    @click.native.stop.prevent="$emit('click', $event)">
    <slot></slot>
  </router-link>
</template>

<script>
import { loadAlbumArt, getColors } from '@/lazy-loaders'

// const defaultColors = 'background-color: #3050ff; color: white'
export default {
  name: 'material-button',
  props: {
    icon: {
      type: Boolean,
      default: false
    },
    floating: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: ''
    },
    flat: {
      type: Boolean,
      default: false
    },
    big: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classList () {
      let classes = []
      classes.push('button')
      if (this.icon) classes.push('icon-button')
      if (this.big) classes.push('big')
      if (this.floating) classes.push('floating')
      if (this.flat) classes.push('flat')
      if (this.rounded) classes.push('rounded')
      return classes
    },
    currentlyPlaying () {
      return this.$store.state.Music.currentlyPlaying
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
    },
    buttonColor () {
      if (this.icon && this.flat) return ''
      if (this.colors) {
        return {
          backgroundColor: this.colors.background
        }
      } else {
        return ''
      }
    }
  }
}
</script>

<style>

  .button {
    background-color: #3080ff;
    color: white;
    border: none;
    transition: background-color 0.3s, box-shadow 0.3s;
    cursor: pointer;
    padding: 10px 1em;
    user-select: none;
    text-decoration: none;
    display: inline-block;
    margin: 5px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.6);
    text-transform: uppercase;
    text-align: center;
    -webkit-app-region: no-drag;
  }
  .button.rounded {
    border-radius: 25px;
    padding: 10px 25px;
  }
  .button:hover, .icon-button:hover {
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.6);
  }
  .icon-button {
    background-color: #3080ff;
    color: white;
    border: none;
    transition: background-color 0.3s;
    border-radius: 50%;
    cursor: pointer;
    user-select: none;
    text-decoration: none;
    display: inline-block;
    width: 32px;
    height: 32px;
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .icon-button.big {
    width: 64px;
    height: 64px;
  }
  .icon-button.big .material-icons {
    font-size: 48px !important;
  }

  .floating {
    position: absolute;
  }
  .button.flat, .button.flat:hover, .button.flat:hover {
    box-shadow: none;
  }
  .icon-button.flat {
    background-color: transparent;
  }
  .icon-button.flat:hover {
    background-color: rgba(0, 0, 0, 0.6);
    box-shadow: none;
  }
</style>
