<template>
  <div id="app" :class="showChrome ? 'pad-body' : ''">
    <chrome :visible="showChrome" />
    <router-view></router-view>
    <media-controls v-if="showMusicBar" />
  </div>
</template>

<script>
  import MediaControls from './components/Partials/MediaControls'
  import Chrome from './components/Chrome'
  export default {
    name: 'blanc',
    components: {
      Chrome,
      MediaControls
    },
    computed: {
      showChrome () {
        return this.$store.state.App.showChrome
      },
      showMusicBar () {
        return this.$store.state.App.showMusicBar
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  #app {
    width: 100%;
    height: 100%;
    background-color: #333;
  }
  * {
    box-sizing: border-box;
  }
  .pad-body {
    padding-top: 1.5em;
    padding-bottom: 70px;
  }
  ::-webkit-scrollbar
  {
    width: 6px;  /* for vertical scrollbars */
    height: 6px; /* for horizontal scrollbars */
  }

  ::-webkit-scrollbar-track
  {
    background: rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
  }

  ::-webkit-scrollbar-thumb
  {
    background: rgba(0, 0, 0, 0.5);
    transition: all 0.3s;
  }
  /* CSS */
</style>
