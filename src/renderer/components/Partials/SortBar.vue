<template>
  <div class="sort-bar" :style="colorfulStyle">
    <span class="sort-bar--item sort-bar-active-indicator"></span>
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
import makeColorful from '@/components/Mixins/Colorful'

export default {
  name: 'sort-bar',
  mixins: [makeColorful()],
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
    transition: background-color 0.3s;
  }
  .sort-bar--item {
    flex-grow: 1;
    padding: 2px 1em;
    text-decoration: none;
    color: white;
    position: relative;
    cursor: pointer;
    /* border-right: 1px solid black; */
  }
  .sort-bar-active-indicator {
    width: 42px;
    flex-grow: 0;
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
