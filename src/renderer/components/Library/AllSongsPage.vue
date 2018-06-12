<template>
  <div class="wrapper">
    <item-column title="all songs" class="fill-height">
      <search-bar v-model="searchString" slot="title-side-content" />
      <sort-bar v-if="librarySorted" :criterias="sortCriterias" @sort="updateSort" />
      <song-list
          :songs="librarySorted"
          @play="play"
          @pause="pause"
          @contextmenu="doContextMenu"
          v-if="librarySorted"
      />
      <loading-indicator v-else />
    </item-column>
    <sweet-modal ref="createPlaylistModal" modal-theme="dark" overlay-theme="dark">
      <input type="text" v-model="playlistName">
      <material-button
        flat
        @click="createPlaylist"
      >
        Create
      </material-button>
    </sweet-modal>
    <sweet-modal icon="error" modal-theme="dark" overlay-theme="dark" ref="playlistExistsErrorModal">
      That playlist already exists!
    </sweet-modal>
    <sweet-modal modal-theme="dark" overlay-theme="dark" ref="showAllPlaylistsModal" title="Select playlist">
      <search-bar v-model="playlistSearch" slot="box-action"/>
      <div class="wrapper" v-if="playlists && playlists.length > 0">
        <list-row
          v-for="{ name } in playlists"
          :key="name"
          :active="playlistName === name"
          @click="playlistName = name"
          :hideDelete="true"
        >
          {{ name }}
        </list-row>
      </div>
      <div class="wrapper-message" v-else>
        <h3>No playlists</h3>
      </div>
      <material-button
        @click="addToPlaylist"
        slot="button"
        flat
      >
        Add
      </material-button>
    </sweet-modal>
  </div>
</template>

<script>
import LoadingIndicator from '@/components/Partials/LoadingIndicator'
import SortBar from '@/components/Partials/SortBar'
import ItemColumn from '@/components/Partials/ItemColumn'
import StaggeredSlideIn from '@/components/Transitions/StaggeredSlideIn'
import SearchBar from '@/components/Partials/SearchBar'
import { remote } from 'electron'
import { default as db } from '@/library.db'
import { fieldCaseInsensitiveSort } from '@/lib/utils'
import SongList from '@/components/Partials/SongList'
import Playlists from '@/lib/playlists'
import MaterialButton from '@/components/Partials/MaterialButton'
import ListRow from '@/components/Partials/ListRow'
const { Menu } = remote
export default {
  name: 'library-all-songs-page',
  data: () => ({
    sort: {
      field: 'title',
      order: 1
    },
    searchString: '',
    sortCriterias: [
      {
        field: 'title',
        title: 'Title'
      },
      {
        field: 'artist',
        title: 'Artist'
      },
      {
        field: 'album',
        title: 'Album'
      }
    ],
    libraryDirty: true,
    skipItems: 0,
    playlistName: '',
    selectedSong: null,
    playlistSearch: '',
    playlists: []
  }),
  computed: {
    librarySorted () {
      if (!this.library) return null
      let clone = this.library
      clone.sort(fieldCaseInsensitiveSort(this.sort.field, this.sort.order))
      if (this.searchString) {
        let searchString = this.searchString.toLowerCase()
        let lib = clone.filter(item => {
          let criteria = []
          if (item.title) criteria.push(item.title)
          if (item.artist) criteria.push(item.artist)
          if (item.artists) criteria.push(item.artists.join())
          if (item.album) criteria.push(item.album)
          if (item.fileName) criteria.push(item.fileName)
          return criteria.reduce((acc, c) => (c.toLowerCase().indexOf(searchString) > -1) || acc, false)
          // return filter.test(item.title) || filter.test(item.artist) || filter.test(item.artists.join()) || filter.test(item.album)
        })
        return lib
      } else {
        return clone
      }
    }
  },
  methods: {
    createPlaylist () {
      if (!this.playlistName) return
      Playlists.createPlaylist(this.playlistName, this.selectedSong._id)
        .then(() => {
          this.$refs.createPlaylistModal.close()
          this.playlistName = ''
        })
        .catch(e => {
          this.$refs.playlistExistsErrorModal.open()
        })
    },
    addToPlaylist () {
      if (!this.playlistName) return
      Playlists.addSongToPlaylist(this.playlistName, this.selectedSong._id)
        .then(() => {
          this.playlistName = ''
        })
    },
    play (item) {
      this.$store.commit('PLAY_MUSIC', item)
    },
    pause () {
      this.$store.commit('PAUSE_MUSIC')
    },
    updateSort (criteria, order) {
      this.sort.field = criteria.field
      this.sort.order = order
    },
    async doContextMenu (item) {
      let playlistTemplate = [
        {
          label: 'Create New',
          click: () => {
            this.selectedSong = item
            this.playlistName = ''
            this.$refs.createPlaylistModal.open()
          }
        }
      ]
      let playlists = await Playlists.getAllPlaylists({ name: 1 })
      this.playlists = playlists
      if (playlists.length > 0) {
        playlistTemplate.push({
          type: 'separator'
        })
        playlists = playlists.slice(0, 10)
        playlists = playlists.map(({ name }) => {
          return {
            label: name,
            click: () => {
              Playlists.addSongToPlaylist(name, item._id)
            }
          }
        })
        playlistTemplate = playlistTemplate.concat(playlists)
        playlistTemplate.push({
          type: 'separator'
        })
        playlistTemplate.push({
          label: 'Show all',
          click: () => {
            this.playlistName = ''
            this.selectedSong = item
            this.$refs.showAllPlaylistsModal.open()
          }
        })
      }
      const template = [
        {
          label: 'Play Next',
          click: () => {
            this.$store.commit('PLAY_NEXT', item)
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Add to playlist',
          submenu: playlistTemplate
        },
        {
          type: 'separator'
        },
        {
          label: 'Play All',
          click: () => {
            this.$store.commit('SET_QUEUE', this.librarySorted)
            this.$store.commit('PLAY_MUSIC', this.librarySorted[0])
          }
        },
        {
          label: 'Queue All',
          click: () => {
            this.$store.commit('SET_QUEUE', this.librarySorted)
          }
        }
      ]
      const menu = Menu.buildFromTemplate(template)
      menu.popup({async: true})
    }
  },
  asyncComputed: {
    library () {
      return db.find({}).execAsync()
    }
  },
  components: {
    SortBar,
    LoadingIndicator,
    ItemColumn,
    StaggeredSlideIn,
    SearchBar,
    SongList,
    MaterialButton,
    ListRow
  }
}
</script>

<style scoped>
  .wrapper.no-scroll {
    overflow: hidden;
  }
  .songs-wrapper {
    width: 100%;
    max-height: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
  }

  .fill-height {
    height: 100%;
  }
  .no-padding {
    padding: 0;
  }
  .songs-wrapper ::-webkit-scrollbar {
    width: 25px;
    height: 25px;
  }
  input[type="text"] {
    min-width: 300px;
    height: 3em;
    border: 1px solid #777;
    border-radius: 5px;
    font-size: 1.1rem;
    font-weight: 100;
    padding: 0 1em;
    color: #777;
    box-sizing: border-box;
  }
  input[type="text"]:focus {
    outline: none !important;
  }
</style>
