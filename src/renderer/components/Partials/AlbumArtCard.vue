<template>
  <div @click="clicked" class="card" :class="(small ? 'card--small ' : ' ') + (vertical ? 'card--vertical ' : ' ')" :style="computedStyle" v-observe-visibility="visibilityChanged">
    <div class="card--image" :style="computedImageStyle">
      <!-- <img :src="image" class="album-art" /> -->
    </div>
    <!-- <div class="card--blur" :style="computedStyle"></div> -->
    <span class="card--contents">
      <p class="card--contents--title">
        <slot name="title"></slot>
      </p>
      <p class="card--contents--text">
        <slot></slot>
      </p>
    </span>
  </div>
</template>

<script>
// import * as Vibrant from 'node-vibrant'
// import * as VibrantWorker from 'node-vibrant/dist/vibrant.worker'
// import { parseFile } from 'music-metadata'
// import mime from 'mime'
// import * as Color from 'color'
import { getColors, loadAlbumArt } from '@/lazy-loaders'
import { toFileURL } from '@/lib/utils'

// console.log(VibrantWorker)

export default {
  name: 'album-art-card',
  props: {
    filePath: String,
    artPath: String,
    art: String,
    colors: {
      type: Object,
      default: null
    },
    small: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    mounted: false,
    visible: true
  }),
  mounted () {
    this.mounted = true
  },
  methods: {
    clicked ($e) {
      this.$emit('click', $e)
    },
    visibilityChanged (isVisible, entry) {
      this.visible = isVisible
    }
  },
  asyncComputed: {
    image () {
      // return null
      if (!this.visible) return null
      if (this.art) return this.art
      if (this.artPath) return Promise.resolve(toFileURL(this.artPath))
      if (!this.filePath) return Promise.resolve('static/albumart-placeholder.png')
      else {
        return loadAlbumArt(this.filePath).then((path) => {
          if (path === 'file:///' || !path) {
            return 'static/albumart-placeholder.png'
          } else {
            return path
          }
        })
      }
    },
    computedImageStyle () {
      // console.log(this.image)
      if (!this.image) return Promise.resolve('')
      else {
        return {
          backgroundImage: 'url(' + this.image + ')'
        }
      }
    },
    computedStyle () {
      // console.log(this.cachedColor)
      if (this.colors) {
        return {
          background: this.colors.background,
          color: this.colors.foreground
        }
      } else {
        if (!this.image || this.image === 'static/albumart-placeholder.png') return ''
        return getColors(this.image).then(colors => {
          return {
            backgroundColor: colors.background,
            color: colors.foreground
          }
        })
      }
    }
  },
  watch: {
    computedStyle (newVal) {
      // console.log(newVal)
    }
  }
}
</script>

<style scoped lang="scss">
  $font-size: 1em;
  $line-height: 1;
  $lines-to-show: 4;
  .card {
    border-radius: 5px;
    background-color: #333;
    color: white;
    margin: 1em;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: row;
    padding: 0;
    height: 128px;
    min-width: 300px;
    transition: box-shadow 0.3s;
    border: none;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }

  .card.card--small {
    max-width: 350px;
  }
  .card.card--small .card--contents p {
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .card.card--vertical {
    flex-direction: column;
    width: 128px;
    height: 200px;
    min-width: 128px;
    max-width: 128px;
    transition: box-shadow 0.3s;
    padding: 0;
  }
  .card.card--vertical .card--contents {
    margin: 0;
    width: 100%;
    padding: 5px;
  }
  .card.card--vertical .card--contents p {
    // margin: 0px;
    // flex-grow: 0;
    // width: 128px;
    // padding: 5px;
    // height: 72px;
    display: block; /* Fallback for non-webkit */
    display: -webkit-box;
    width: 100%;
    height: $font-size*$line-height*$lines-to-show; /* Fallback for non-webkit */
    margin: 0;
    font-size: $font-size;
    line-height: $line-height;
    -webkit-line-clamp: $lines-to-show;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .card.card.card--vertical .card--contents--text {
    display: none;
  }
  .card.card--vertical:hover {
    box-shadow: 0 25px 30px -10px rgba(0, 0, 0, 0.6);
  }
  .card.card--vertical:after {
    display: none;
  }


  .card--contents--title, .card--contents--title p {
    margin: 0;
  }
  .card--contents--text {
    display: block; /* Fallback for non-webkit */
    display: -webkit-box;
    max-width: 100%;
    height: $font-size*$line-height*$lines-to-show; /* Fallback for non-webkit */
    margin: 0;
    font-size: $font-size;
    line-height: $line-height;
    -webkit-line-clamp: $lines-to-show;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .card:focus, .card:hover {
    outline: none;
  }

  .card--image {
    padding: 0;
    flex-shrink: 0;
    width: 128px;
    height: 128px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .card--blur {
    position: absolute;
    top: 0;
    height: 99%;
    width: 5px;
    left: 125px;
    content: '';
    background-color: rgba(0, 0, 0, 0.01);
    filter: blur(2px);
  }
  .card--contents {
    margin: 1em;
    word-wrap: break-word;
    /* white-space: pre-wrap; */
    flex-grow: 1;
    width: 150px;
  }
  .album-art {
    width: 128px;
    height: 100%;
    /* height: auto; */
  }
  .card::after {
    content: 'keyboard_arrow_right';
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    padding-top: 0.5em;
    font-size: 4em;
    display: inline-block;
    vertical-align: middle;
    height: 100%;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    position: absolute;
    right: -5em;
    transition: all 0.3s;
    background-color: rgba(0, 0, 0, 0.1);

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;

    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
  }
  .card:hover::after, .card:focus::after {
    right: 0;
  }
</style>
