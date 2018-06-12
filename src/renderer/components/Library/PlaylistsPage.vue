<template>
  <div class="wrapper d-flex">
    <template v-if="playlists && playlists.length > 0">
      <div class="navbar">
        <nav class="navbar-items">
          <ul>
            <li><span class="navbar-group-header">Playlists</span></li>
            <li v-for="playlist in playlists" :key="playlist.name">
              <router-link
                class="navbar-item"
                :class="(playlistID === playlist._id) ? 'navbar-item--active': ''"
                @contextmenu.native="doContextMenu(playlist)"
                :to="'/library/playlists/' + playlist._id">
                <span v-if="editing !== playlist._id">{{ playlist.name }}</span>
                <input
                  v-else
                  class="edit-name-input"
                  v-model="newName"
                  @keyup.enter="changeName"
                  @keyup.esc="editing = ''"
                  :style="borderBottomColor"
                  @blur="editInputFocused = false"
                  @focus="editInputFocused = true"
                />
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
      <item-column :title="playlist && playlist.name">
        <search-bar v-model="searchString" slot="title-side-content" />
        <song-list
          :songs="shownPlaylistSongs"
          v-if="shownPlaylistSongs"
          @play="play"
          @pause="pause"
          @contextmenu="doSongContextMenu"
        />
        <loading-indicator v-else />
      </item-column>
    </template>
    <div class="wrapper-message" v-else-if="playlists && playlists.length === 0">
      <h1>:(</h1>
      <h3>You have no playlists, create one here <router-link to="/library">here</router-link> (right-click a song).</h3>
    </div>
    <loading-indicator v-else />
  </div>
</template>

<script>
import ItemColumn from '@/components/Partials/ItemColumn'
import SearchBar from '@/components/Partials/SearchBar'
import LoadingIndicator from '@/components/Partials/LoadingIndicator'
import { playlistsDB } from '@/library.db'
import { getSong } from '../../lazy-loaders'
import SongList from '../Partials/SongList'
import { remote } from 'electron'
import playlists from '../../lib/playlists'
import makeColorful from '../Mixins/Colorful'
const { Menu } = remote
export default {
  data: () => ({
    searchString: '',
    editing: '',
    newName: '',
    editInputFocused: false,
    playlists: []
  }),
  mixins: [makeColorful()],
  mounted () {
    let live = playlistsDB.find({}).live()
    playlistsDB.on('liveQueryUpdate', () => {
      this.playlists = live.res
    })
  },
  computed: {
    playlistID () {
      return this.$route.params.playlistID || this.playlists[0]._id
    },
    borderBottomColor () {
      let base = {
        borderBottomWidth: '2px'
      }
      if (this.editInputFocused) {
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
  asyncComputed: {
    playlist () {
      if (!this.playlists) return null
      return this.playlists.find(playlist => playlist._id === this.playlistID)
    },
    playlistSongs () {
      if (!this.playlist) return null
      return Promise.all(this.playlist.songs.map(getSong))
    },
    shownPlaylistSongs () {
      if (!this.playlistSongs) return null
      let searchString = this.searchString.toLowerCase()
      if (searchString) {
        return this.playlistSongs.filter(item => {
          let criteria = []
          if (item.title) criteria.push(item.title)
          if (item.artist) criteria.push(item.artist)
          if (item.artists) criteria.push(item.artists.join())
          if (item.album) criteria.push(item.album)
          if (item.fileName) criteria.push(item.fileName)
          return criteria.reduce((acc, c) => (c.toLowerCase().indexOf(searchString) > -1) || acc, false)
        })
      } else {
        return this.playlistSongs
      }
    }
  },
  components: {
    ItemColumn,
    SearchBar,
    LoadingIndicator,
    SongList
  },
  methods: {
    play (item) {
      this.$store.commit('PLAY_MUSIC', item)
    },
    pause () {
      this.$store.commit('PAUSE_MUSIC')
    },
    doContextMenu (playlist) {
      const template = [
        {
          label: 'Edit Name',
          click: () => {
            this.newName = playlist.name
            this.editing = playlist._id
          }
        },
        {
          label: 'Delete',
          click: () => {
            if (this.playlistID === playlist._id) {
              if (this.playlists.length > 1) {
                let index = this.playlists.findIndex(p => p._id === this.playlistID)
                let nextID = ''
                if (index < this.playlists.length - 1) nextID = this.playlists[index + 1]._id
                else nextID = this.playlists[0]._id
                this.$router.push({
                  name: this.$route.name,
                  params: {
                    playlistID: nextID
                  }
                })
              }
            }
            playlists.deletePlaylist(playlist.name)
          }
        }
      ]
      const menu = Menu.buildFromTemplate(template)
      menu.popup({ async: true })
    },
    changeName () {
      let playlist = this.playlists.find(p => p._id === this.editing)
      playlists.changeName(playlist.name, this.newName)
        .then(_ => {
          this.editing = ''
          this.newName = ''
        })
    },
    doSongContextMenu (item) {
      const template = [
        {
          label: 'Play Now',
          click: () => {
            this.$store.commit('PLAY_MUSIC', item)
          }
        },
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
          label: 'Add all to queue',
          click: () => {
            this.$store.commit('QUEUE_SONGS', this.shownPlaylistSongs)
          }
        },
        {
          label: 'Play all',
          click: () => {
            this.$store.commit('SET_QUEUE', this.shownPlaylistSongs)
            this.$store.commit('PLAY_MUSIC', this.shownPlaylistSongs[0])
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Remove from playlist',
          click: () => {
            this.playlist.songs = this.playlist.songs.filter(id => id !== item._id)
            this.playlist.save()
          }
        }
      ]
      const menu = Menu.buildFromTemplate(template)
      menu.popup({async: true})
    }
  }
}
</script>

<style>
  .d-flex {
    display: flex;
  }
  .edit-name-input {
    border: none;
    border-bottom: 1px solid #333;
    width: 100%;
    height: 24px;
    background-color: transparent;
    color: white;
    padding: 0 1em;
    font-size: 1em;
  }
  .edit-name-input:focus {
    outline: none;
    border-bottom-width: 2px;
  }
</style>
