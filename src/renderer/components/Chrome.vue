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
    height: 1em;
    background-color: #333;
    width: 100%;
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    z-index: 1000;
  }
  .spacer {
    flex-grow: 1;
  }
  #window-buttons {
    background-color: #333;
    display: flex;
    height: 1em;
    flex-direction: row;
  }
  #window-buttons button {
    color: white;
    background: transparent;
    border: none;
    height: 100%;
    padding: 0 5px;
    cursor: pointer;
    transition: all 0.3s;
  }
  #window-buttons button:focus {
    outline: none;
  }
  #window-buttons button:hover {
    background: #666;
  }

</style>
