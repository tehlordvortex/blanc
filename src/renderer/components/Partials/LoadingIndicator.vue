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
    }
  },
  computed: {
    classList () {
      let c = []
      if (this.fullWidth) c.push('full-width')
      if (this.fullHeight) c.push('full-height')
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
    height: 128px;
    width: 128%;
  }

  .loading-indicator.full-width {
    width: 100%;
  }
  .loading-indicator.full-height {
    height: 100%;
  }

</style>
