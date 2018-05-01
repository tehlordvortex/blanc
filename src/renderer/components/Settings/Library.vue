<template>
  <div class="wrapper">
    <section>
      <p class="section-header">Libraries</p>
      <dropzone
        @drop="dropPath"
        @click="choosePath">
        <p class="large-icon"><i class="material-icons">folder</i></p>
        <p>Drop a folder here to add it to your library</p>
      </dropzone>
      <material-button
        :disabled="indexing"
        @click="refreshLibraries"
        >
        Refresh Libraries
      </material-button>
      <transition-group
        tag="div"
        name="animated-slide-in"
        mode="out-in"
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutLeft"
      >
        <list-row
          v-for="library in librariesClone"
          :key="library"
          @delete="removeLibrary(library)"
        >
          <p>{{ library }}</p>
        </list-row>
      </transition-group>
    </section>
  </div>
</template>

<script>
import Dropzone from '@/components/Partials/Dropzone'
import ListRow from '@/components/Partials/ListRow'
import MaterialButton from '@/components/Partials/MaterialButton'
import settings from '@/lib/settings'
import { addFiles, removeFiles } from '@/indexer.lib'
import { ipcRenderer } from 'electron'

export default {
  name: 'library-settings',
  components: {
    Dropzone,
    ListRow,
    MaterialButton
  },
  data: () => ({
    librariesClone: settings.libraries
  }),
  computed: {
    libraries: {
      get () {
        return settings.libraries
      },
      set (libs) {
        settings.libraries = libs
      }
    },
    indexing () {
      return this.$store.state.Library.indexing
    }
  },
  watch: {
    librariesClone (newVal) {
      settings.libraries = newVal
    }
  },
  methods: {
    dropPath (event) {
      if (this.indexing) return
      let files = event.dataTransfer.files
      this.librariesClone.push(files[0].path)
    },
    choosePath () {
      if (this.indexing) return
      ipcRenderer.once('dialog-selected-folder', (event, path) => {
        if (path) this.librariesClone.push(path)
      })
      ipcRenderer.send('dialog-select-folder', this.libraryPath)
    },
    removeLibrary (lib) {
      if (this.indexing) return
      removeFiles(lib).then(() => {
        this.librariesClone = this.librariesClone.filter(item => item !== lib)
      })
    },
    async refreshLibraries () {
      if (this.indexing) return
      for (const library of this.librariesClone) {
        await addFiles(library)
      }
    }
  }
}
</script>

<style scoped>
  section {
    margin: 1em;
  }
  .section-header {
    text-transform: uppercase;
    font-weight: lighter;
    color: white;
  }
</style>
