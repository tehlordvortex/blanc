<template>
  <div @click="$emit('click', $event)" class="music-item-tile" :style="active ? (computedStyle ? computedStyle : defaultActiveStyle) : ''">
    <div class="music-item-tile--art" v-if="showArt" :style="computedImageStyle">
    </div>
    <div class="music-item-tile--details">
      <slot></slot>
    </div>
    <div class="music-item-tile--actions">
      <i
        class="material-icons icon-button"
        @click.stop="$emit(active ? 'pause' : 'play', $event)"
        >{{ active ? 'pause' : 'play_arrow' }}</i>
    </div>
  </div>
</template>

<script>
import { computedImage, computedImageStyle, computedStyle } from '@/lazy-loaders'
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
    artPath: String,
    active: {
      type: Boolean,
      default: false
    }
  },
  asyncComputed: {
    image () {
      if (!this.artPath) return Promise.resolve('')
      else return computedImage(this.artPath)()
    },
    computedImageStyle () {
      // console.log(this.image)
      if (!this.image) return Promise.resolve('')
      else return computedImageStyle(this.image)()
    },
    computedStyle () {
      if (!this.image) return Promise.resolve('')
      else return computedStyle(this.image, false, this.artPath)()
    }
  }
}
</script>

<style scoped>
  .music-item-tile {
    background-color: #222;
    padding: 5px 1em;
    display: flex;
    border-bottom: 1px solid grey;
    min-height: 74px;
    color: white;
    transition: background-color 0.5s;
    cursor: pointer;
  }
  .music-item-tile--art {
    padding: 0;
    width: 64px;
    height: 64px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .music-item-tile--details {
    flex-grow: 1;
    padding: 1em;
  }
  .music-item-tile--actions {
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
</style>
