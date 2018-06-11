<template>
  <div class="searchbar">
    <div class="searchbar-items">
      <input
        type="text" 
        class="searchbar-text"
        :value="value"
        @input="$emit('input', $event.target.value)"
        @keyup.esc="handleEsc"
        @keyup.enter="$emit('input', $event.target.value)"
        tabindex="0"
        :style="borderBottomColor"
        ref="input" />
      <span class="searchbar-icon">
        <i class="material-icons">search</i>
      </span>
    </div>
  </div>
</template>

<script>
import * as Mousetrap from 'mousetrap'
import makeColorful from '@/components/Mixins/Colorful'

export default {
  name: 'search-bar',
  mixins: [makeColorful(false)],
  data: () => ({
    timeout: null,
    focused: false
  }),
  props: {
    value: String
  },
  mounted () {
    Mousetrap.bind(['/', 'f'], (e) => {
      e.stopPropagation() // these two lines prevent the input element from capturing the key on focus
      e.preventDefault()
      this.$el.focus()
      this.$refs.input.focus()
    }, 'keyup')
    this.$refs.input.addEventListener('focus', () => { this.focused = true })
    this.$refs.input.addEventListener('blur', () => { this.focused = false })
  },
  computed: {
    borderBottomColor () {
      let base = {
        borderBottomWidth: '2px'
      }
      if (this.focused) {
        if (this.colors) {
          return Object.assign(base, {
            borderBottomColor: this.colors.background
          })
        } else {
          return Object.assign(base, {
            borderBottomColor: '#3080ff'
          })
        }
      }
    }
  },
  methods: {
    handleEsc ($event) {
      $event.target.value = ''
      this.$emit('input', '')
      // this.$refs.input.blur()
      // this.$el.blur()
    }
  }
}
</script>

<style>
  .searchbar {
    /* position: fixed; */
    right: 1em;
    top: 2em;
    min-width: 32px;
    min-height: 32px;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 2px 5px;
    z-index: 10;
    width: 300px;
    color: white;
    -webkit-app-region: no-drag;
  }
  .searchbar-items {
    position: relative;
    height: 24px;
    width: 290px;
    transition: width 0.3s;
    -webkit-app-region: no-drag;
  }
  .searchbar-text {
    display: inline-block;
    width: 100%;
    z-index: -1;
    height: 24px;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid grey;
    color: white;
    font-size: 1em;
    right: 0;
    top: 5px;
    z-index: 4;
    padding-left: 32px;
    -webkit-app-region: no-drag;
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
    left: 0em;
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
