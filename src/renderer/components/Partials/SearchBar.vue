<template>
  <div class="searchbar">
    <div class="searchbar-items">
      <input
        type="text" 
        class="searchbar-text animated slideInRight"
        :value="value"
        @input="$emit('input', $event.target.value)"
        @keyup.esc="handleEsc"
        @keyup.enter="$emit('input', $event.target.value)"
        tabindex="0"
        ref="input" />
      <span class="searchbar-icon">
        <i class="material-icons">search</i>
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'search-bar',
  data: () => ({
    timeout: null
  }),
  props: {
    value: String
  },
  computed: {
    currentlyPlaying () {
      return this.$store.state.Music.currentlyPlaying
    },
    borderBottomColor () {
      if (this.currentlyPlaying && this.currentlyPlaying.colors) {
        return {
          backgroundColor: this.currentlyPlaying.colors.background,
          color: this.currentlyPlaying.foreground
        }
      } else {
        return '#3080ff'
      }
    }
  },
  methods: {
    handleEsc ($event) {
      $event.target.value = ''
      this.$emit('input', '')
      this.$refs.input.blur()
    }
  }
}
</script>

<style>
  .searchbar {
    position: fixed;
    right: 1em;
    top: 2em;
    min-width: 32px;
    min-height: 32px;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 5px;
    z-index: 10;
    max-width: 300px;
    color: white;
  }
  .searchbar-items {
    position: relative;
    height: 24px;
    max-width: 290px;
    transition: width 0.3s;
  }
  .searchbar-text {
    display: inline-block;
    width: 0;
    z-index: -1;
    height: 24px;
    background-color: transparent;
    border: none;
    border-bottom: 2px solid grey;
    color: white;
    font-size: 1em;
    transition: width 0.5s;
    /* position: absolute; */
    right: 0;
    top: 5px;
    z-index: 4;
  }
  .searchbar-text:focus {
    outline: none;
    border-bottom-color: #3080ff;
    display: inline-block;
    padding-right: 24px;
    width: 290px;
  }

  .searchbar-icon {
    position: absolute;
    right: 0em;
    top: 0em;
    z-index: 3;
  }
  .searchbar:hover .searchbar-items {
    width: 290px;
  }
  .searchbar:hover .searchbar-text {
    width: 290px;
  }
  .searchbar-items:focus ~ .searchbar-text {
    display: inline-block;
  }
  .searchbar:hover .searchbar-text, .searchbar:focus .searchbar-text {
    display: inline-block;
  }
</style>
