<template>
  <div id="top-bar" v-if="visible">
    <div id="window-buttons">
      <button v-if="routeHistoryLength > 2" @click="goBack"><i class="material-icons">arrow_back</i></button>
      <span class="spacer">
        <progress-bar
          v-if="indexing"
          :val="indexPercent"
        ></progress-bar>
      </span>
      <button @click="minimizeApp"><i class="material-icons">remove</i></button>
      <button @click="closeApp"><i class="material-icons">close</i></button>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import ProgressBar from 'vue-simple-progress'

export default {
  name: 'chrome',
  props: {
    visible: Boolean
  },
  components: {
    ProgressBar
  },
  methods: {
    closeApp () {
      ipcRenderer.send('close-app')
    },
    minimizeApp () {
      ipcRenderer.send('minimize-app')
    },
    goBack () {
      this.$router.go(-1)
    }
  },
  computed: {
    routeHistoryLength () {
      return this.$store.state.App.routeHistory.length
    },
    indexPercent () {
      return this.$store.state.Library.indexProgress * 100
    },
    indexing () {
      return this.$store.state.Library.indexing
    }
  }
}
</script>

<style scoped>
  #top-bar {
    height: 1.5em;
    background-color: #333;
    width: 100%;
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    z-index: 1000;
    -webkit-app-region: drag;
  }
  .spacer {
    flex-grow: 1;
    height: 100%;
    padding-top: 11px;
    -webkit-app-region: drag;
  }
  #window-buttons {
    background-color: #333;
    display: flex;
    height: 1.5em;
    flex-direction: row;
    -webkit-app-region: no-drag;
  }
  #window-buttons button {
    color: white;
    background: transparent;
    border: none;
    height: 100%;
    padding: 0 5px;
    cursor: pointer;
    transition: all 0.3s;
    -webkit-app-region: no-drag;
  }
  #window-buttons button:focus {
    outline: none;
  }
  #window-buttons button:hover {
    background: #666;
  }

</style>
