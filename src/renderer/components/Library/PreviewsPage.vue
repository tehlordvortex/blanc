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
    <material-button class="right" @click="gotoAlbums" center>
      view all
    </material-button>
  <!-- </div> -->
  <!-- <div class="item-column">
    <span class="item-column--title">Songs</span> -->
    <item-column title="songs">
      <staggered-slide-in tag="div" class="item-column--content" v-if="library" :scale="0.05">
        <music-item-tile
          v-for="(item, index) in library" :key="'all-songs-' + item.filePath"
          :item="item"
          :active="musicStatus === 'playing' && currentlyPlaying && item.filePath === currentlyPlaying.filePath"
          @play="play(item)"
          @pause="pause()"
          @click="play(item)"
          :showArt="false"
          :data-staggered-index="index"
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
// import db from '@/library.db'
// import { getAlbums, getLibrary } from '@/lazy-loaders'
import LoadingIndicator from '@/components/Partials/LoadingIndicator'

// import { getAlbumArt } from '@/lazy-loaders'

export default {
  name: 'library-landing-page',
  data: () => ({
  }),
  computed: {
    currentlyPlaying () {
      return this.$store.state.Music.currentlyPlaying
    },
    musicStatus () {
      return this.$store.state.Music.status
    },
    rawLibrary () {
      return this.$store.state.Library.library
    },
    library () {
      if (!this.rawLibrary) return null
      let startIndex = Math.floor(Math.random() * (this.rawLibrary.length - 30))
      let endIndex = Math.floor(10 + (Math.random() * 30)) + startIndex
      if (endIndex > this.rawLibrary.length || endIndex === 0) endIndex = this.rawLibrary.length
      let slicedLibrary = this.rawLibrary.slice(startIndex, endIndex)
      return slicedLibrary
    },
    albums () {
      // return new Promise((resolve, reject) => {
      //   albumsDB.find({}).sort({ name: 1 }).exec((err, docs) => {
      //     if (err) reject(err)
      //     else {
      //       resolve(docs)
      //     }
      //   })
      // })
      // return db.cfind({ album: { $nin: ['', null, undefined] } }).sort({ album: 1, title: 1 }).exec().then((docs) => {
      //   let albums = []
      //   docs.forEach(doc => {
      //     if (!albums.some(album => album.name === doc.album)) {
      //       let album = {
      //         name: doc.album
      //       }
      //       album.colors = doc.colors
      //       // let p = getAlbumArt(doc.filePath)
      //       // // console.log(p)
      //       // albums.push(p.then((art) => {
      //       //   // console.log('gotten art', art)
      //       //   if (art && !album.art) {
      //       //     album.art = art
      //       //   }
      //       // }).then(() => album))
      //       albums.push(album)
      //     } else {
      //       let album = albums.find(album => album.name === doc.album)
      //       if (!album.art && doc.albumArt) {
      //         album.art = doc.albumArt
      //       }
      //     }
      //   })
      //   return Promise.all(albums)
      // })
      if (!this.$store.state.Library.albums) return null
      else return this.$store.state.Library.albums.slice(0, 10)
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
