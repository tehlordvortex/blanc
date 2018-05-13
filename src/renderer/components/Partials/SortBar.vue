<template>
  <div class="sort-bar" :style="computedStyle">
    <a
      v-for="(criteria, index) in criterias"
      :key="index"
      class="sort-bar--item"
      :class="sortedBy === criteria ? ('sort-bar--item-active' + ' ' + (sortOrder === 1 ? 'sort-bar--item-asc' : 'sort-bar--item-desc')) : ''"
      @click.stop="sortBy(criteria)"
    >
      {{ criteria.title || criteria }}
    </a>
  </div>

</template>

<script>
import { getColors, loadAlbumArt } from '@/lazy-loaders'
import Color from 'color'

export default {
  name: 'sort-bar',
  props: {
    criterias: {
      type: Array,
      default: () => ([]),
      required: true
    },
    default: {
      type: Object,
      default: () => null
    }
  },
  data: () => ({
    sortedBy: null,
    sortOrder: 1
  }),
  created () {
    this.sortedBy = this.default || this.criterias[0]
  },
  methods: {
    sortBy (criteria) {
      if (this.sortedBy === criteria) {
        this.sortOrder *= -1
      } else {
        this.sortedBy = criteria
        this.sortOrder = 1
      }
      this.$emit('sort', this.sortedBy, this.sortOrder)
    }
  },
  computed: {
    currentlyPlaying () {
      return this.$store.state.Music.currentlyPlaying
    }
  },
  asyncComputed: {
    computedStyle () {
      if (this.currentlyPlaying && this.currentlyPlaying.albumArt) {
        return getColors(this.currentlyPlaying.albumArt).then(colors => {
          if (colors && colors.background) {
            let color = Color(colors.background)
            return {
              background: (color.isDark() ? color.lighten(0.3) : color.darken(0.3)).rgb().string()
            }
          } else {
            return {}
          }
        })
      } else if (this.currentlyPlaying) {
        return loadAlbumArt(this.currentlyPlaying.filePath).then(path => getColors(path))
      } else {
        return ''
      }
    }
  }
}
</script>

<style>
  .sort-bar {
    width: 100%;
    position: sticky;
    display: flex;
    height: 24px;
    color: white;
    background-color: #222;
    border-bottom: 1px solid grey;
    transition: background-color 0.3s;
  }
  .sort-bar--item {
    flex-grow: 1;
    padding: 2px 1em;
    text-decoration: none;
    color: white;
    position: relative;
    cursor: pointer;

  }
  .sort-bar--item.sort-bar--item-active {
    background-color: rgba(0, 0, 0, 0.3);
  }

  .sort-bar--item.sort-bar--item-asc::after {
    content: 'keyboard_arrow_up';
  }
  .sort-bar--item.sort-bar--item-desc::after {
    content: 'keyboard_arrow_down';
  }
  .sort-bar--item.sort-bar--item-asc::after, .sort-bar--item.sort-bar--item-desc::after {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    display: inline-block;
    /* vertical-align: middle; */
    /* width: 24px;
    height: 24px; */
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    position: absolute;
    right: 0em;
    bottom: 0em;
    transition: all 0.3s;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
  }
</style>
