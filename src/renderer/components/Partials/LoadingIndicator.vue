<template>
  <div class="loading-indicator" :class="classList">
    <Spinner :name="name" :color="colorUsed" />
  </div>
</template>

<script>
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
    colorUsed () {
      return this.color || (this.currentlyPlaying && this.currentlyPlaying.colors && this.currentlyPlaying.colors.background) || '#3080ff'
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
