<template>
  <div id="app" :class="showChrome ? 'pad-top' : ''">
    <chrome :visible="showChrome" />
    <router-view></router-view>
  </div>
</template>

<script>
  import Chrome from './components/Chrome'
  export default {
    name: 'blanc',
    components: {
      Chrome
    },
    computed: {
      showChrome () {
        return this.$store.state.App.showChrome
      }
    }
  }
</script>

<style>
  body, html {
    height: 100%;
  }
  body {
    margin: 0;
    overflow: hidden;
  }
  #app {
    width: 100%;
    height: 100%;
  }
  * {
    box-sizing: border-box;
  }
  .pad-top {
    padding-top: 1em;
  }
  ::-webkit-scrollbar
  {
    width: 6px;  /* for vertical scrollbars */
    height: 6px; /* for horizontal scrollbars */
  }

  ::-webkit-scrollbar-track
  {
    background: rgba(0, 0, 0, 0.1);
  }

  ::-webkit-scrollbar-thumb
  {
    background: rgba(0, 0, 0, 0.5);
  }
  /* CSS */
</style>
