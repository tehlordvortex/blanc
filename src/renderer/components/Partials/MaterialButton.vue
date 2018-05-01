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
import { toColorString } from '@/lazy-loaders'

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
    }
  },
  computed: {
    classList () {
      let classes = []
      if (this.icon) classes.push('icon-button')
      else classes.push('button')
      if (this.floating) classes.push('floating')
      if (this.flat) classes.push('flat')
      return classes
    },
    currentlyPlaying () {
      return this.$store.state.Music.currentlyPlaying
    },
    buttonColor () {
      if (this.currentlyPlaying && this.currentlyPlaying.colors) {
        return toColorString(this.currentlyPlaying.colors)
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
  }
  .button:hover, .button:focus {
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.6);
    background-color: #3585ff;
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
    text-decoration: none;
    display: inline-block;
  }

  .icon-button:hover, .icon-button:focus {
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
  }

  .floating {
    position: absolute;
  }
  .button.flat, .button.flat:hover, .button.flat:hover {
    box-shadow: none;
  }
</style>
