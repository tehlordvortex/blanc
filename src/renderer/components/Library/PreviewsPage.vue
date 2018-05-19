<template>
  <div class="wrapper">
    <item-row title="albums" style="min-height: 250px">
      <template v-if="albums">
        <album-art-card
          @click="gotoAlbum(item)"
          v-for="item in albums"
          v-if="item.name"
          :key="'albums-' + item.name"
          :artPath="item.art"
          :colors="item.colors"
          small
          >
          <p>{{ item.name }}</p>
          <p>{{ item.artists.join(',') }}</p>
        </album-art-card>
      </template>
      <loading-indicator name="line-scale" v-else />
    </item-row>
    <material-button class="right" @click="gotoAlbums" flat rounded>
      view all
    </material-button>
  <!-- </div> -->
  <!-- <div class="item-column">
    <span class="item-column--title">Songs</span> -->
    <item-column title="songs">
      <staggered-slide-in tag="div" class="item-column--content" v-if="library" :scale="0.05">
        <music-item-tile
          v-for="(item, index) in library" :key="'all-songs-' + item.filePath"
          :itemID="item._id"
          :active="musicStatus === 'playing' && currentlyPlaying && item.filePath === currentlyPlaying.filePath"
          @play="play(item)"
          @pause="pause()"
          @click="play(item)"
          :showArt="false"
          :data-staggered-index="index"
          @contextmenu="doContextMenu(item)"
          >
          <p>{{ item.title }}</p>
          <p>{{ item.artist }}</p>
        </music-item-tile>
      </staggered-slide-in>
      <loading-indicator v-else />
    </item-column>
    <material-button
      @click="gotoAllSongs"
      class="right"
      rounded
      flat
    >View All</material-button>
  </div>
</template>

<script>
import AlbumArtCard from '@/components/Partials/AlbumArtCard'
import MusicItemTile from '@/components/Partials/MusicItemTile'
import Card from '@/components/Partials/Card'
import StaggeredSlideIn from '@/components/Transitions/StaggeredSlideIn'
import ItemRow from '@/components/Partials/ItemRow'
import ItemColumn from '@/components/Partials/ItemColumn'
import MaterialButton from '@/components/Partials/MaterialButton'
// import { getSong } from '@/lazy-loaders'
import LoadingIndicator from '@/components/Partials/LoadingIndicator'
import { remote } from 'electron'

const { Menu } = remote

export default {
  name: 'library-landing-page',
  data: () => ({
    slicedLibrary: null,
    slicedAlbums: null
  }),
  asyncComputed: {
    // rawAlbums () {
    //   return albumsDB.find({}).execAsync()
    // },
    // rawLibrary () {
    //   return db.find({}).execAsync()
    // }
  },
  computed: {
    currentlyPlaying () {
      return this.$store.state.Music.currentlyPlaying
    },
    musicStatus () {
      return this.$store.state.Music.status
    },
    library () {
      // liveLibrary.refresh()
      // setTimeout(() => {
      //   this.slicedLibrary = liveLibrary.res.slice(0, 10)
      // }, 2000)
      // if (!liveLibrary.res) return null
      return (this.$store.state.Library.library && this.$store.state.Library.library.slice(0, 20)) || null
      // console.log(liveLibrary.res)
      // let startIndex = Math.floor(Math.random() * (liveLibrary.res.length - 30))
      // let endIndex = Math.floor(10 + (Math.random() * 30)) + startIndex
      // if (endIndex > liveLibrary.res.length || endIndex === 0) endIndex = liveLibrary.res.length
      // let slicedLibrary = liveLibrary.res.slice(0, 10)
      // return slicedLibrary
      // return null
    },
    albums () {
      return (this.$store.state.Library.albums && this.$store.state.Library.albums.slice(0, 20)) || null
      // liveAlbums.refresh()
      // setTimeout(() => {
      //   this.slicedAlbums = liveAlbums.res.slice(0, 10)
      // }, 2000)
      // if (!liveAlbums.res) return null
      // else {
      //   return null
      //   // console.log(liveAlbums.res)
      //   // let startIndex = Math.floor(Math.random() * (liveAlbums.res.length - 10))
      //   // let endIndex = Math.floor(10 + (Math.random() * 6)) + startIndex
      //   // if (endIndex > liveAlbums.res.length || endIndex === 0) endIndex = liveAlbums.res.length
      //   // let slicedAlbums = liveAlbums.res.slice(startIndex, endIndex)
      //   // return slicedAlbums
      // }
    }
  },
  components: {
    Card,
    AlbumArtCard,
    MusicItemTile,
    StaggeredSlideIn,
    ItemRow,
    ItemColumn,
    MaterialButton,
    LoadingIndicator
  },
  methods: {
    play (item) {
      console.log('Playing', item)
      this.$store.commit('PLAY_MUSIC', item)
    },
    pause () {
      this.$store.commit('PAUSE_MUSIC')
    },
    gotoAlbum (item) {
      this.$router.push({
        name: 'library-album-page',
        params: {
          album: item.name
        }
      })
    },
    gotoAlbums () {
      this.$router.push({
        name: 'library-album-page'
      })
    },
    gotoAllSongs () {
      this.$router.push({
        name: 'library-all-songs-page'
      })
    },
    doContextMenu (item) {
      const template = [{
        label: 'Play Next',
        click: () => {
          this.$store.commit('PLAY_NEXT', item)
        }
      }]
      const menu = Menu.buildFromTemplate(template)
      menu.popup({async: true})
    }
  }
}
</script>

<style scoped>
  .right {
    float: right;
  }
  .right::after {
    clear: both;
    content: '';
    display: table;
  }
</style>
