<template>
  <div id="top-bar" v-if="visible">
    <div id="window-buttons">
      <span class="spacer"></span>
      <button @click="minimizeApp">-</button>
      <button @click="closeApp">&times;</button>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'chrome',
  props: {
    visible: Boolean
  },
  methods: {
    closeApp () {
      ipcRenderer.send('close-app')
    },
    minimizeApp () {
      ipcRenderer.send('minimize-app')
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
