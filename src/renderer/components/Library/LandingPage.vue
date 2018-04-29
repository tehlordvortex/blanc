<template>
  <div id="wrapper">
    <div class="item-row">
      <span class="item-row--title">Albums</span>
      <div class="item-row--content" v-if="albums">
        <album-art-card @click="gotoAlbum(item)" v-for="item in albums" :key="'albums-' + item.filePath" hasImage :filePath="item.filePath">
          {{ item.name }}
        </album-art-card>
        <card>
          <p>View all</p>
        </card>
      </div>
    </div>
    <div class="item-column">
      <span class="item-column--title">Songs</span>
      <staggered-slide-in tag="div" class="item-column--content" v-if="library">
        <music-item-tile
          v-for="(item, index) in library" :key="'all-songs-' + item.filePath"
          :artPath="item.filePath"
          :active="musicStatus === 'playing' && currentlyPlaying && item.filePath === currentlyPlaying.filePath"
          @play="play(item)"
          @pause="pause()"
          @click="play(item)"
          :scale="0.05"
          :data-staggered-index="index"
          >
          {{ item.title }}
        </music-item-tile>
      </staggered-slide-in>
    </div>
  </div>
</template>

<script>
// import AlbumArt from '@/components/Partials/AlbumArt'
import AlbumArtCard from '@/components/Partials/AlbumArtCard'
import MusicItemTile from '@/components/Partials/MusicItemTile'
import Card from '@/components/Partials/Card'
import StaggeredSlideIn from '@/components/Transitions/StaggeredSlideIn'
import db from '@/library.db'

export default {
  name: 'library-landing-page',
  data: () => ({
  }),
  asyncComputed: {
    library () {
      return new Promise((resolve, reject) => {
        db.find({ title: { $ne: '' } }).sort({ title: 1 }).exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            let startIndex = Math.floor(Math.random() * (res.length - 30))
            let endIndex = Math.floor(Math.random() * 30) + startIndex
            if (endIndex > res.length) endIndex = res.length
            resolve(res.slice(startIndex, endIndex))
          }
        })
      })
    },
    albums () {
      return new Promise((resolve, reject) => {
        let albums = []
        db.find({ album: { $ne: null } }).sort({ album: 1 }).exec((err, docs) => {
          if (err) reject(err)
          else {
            docs.forEach(doc => {
              if (!albums.some(album => album.name === doc.album)) {
                albums.push({
                  name: doc.album,
                  filePath: doc.filePath
                })
              }
            })
            let startIndex = Math.floor(Math.random() * (albums.length / 2))
            let endIndex = Math.floor(Math.random() * 30) + startIndex
            if (endIndex > albums.length) endIndex = albums.length
            resolve(albums.sort((a, b) => a.name < b.name).slice(startIndex, endIndex))
          }
        })
      })
    }
  },
  components: {
    Card,
    AlbumArtCard,
    MusicItemTile,
    StaggeredSlideIn
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
    }
  },
  computed: {
    currentlyPlaying () {
      return this.$store.state.Music.currentlyPlaying
    },
    musicStatus () {
      return this.$store.state.Music.status
    }
  }
}
</script>

<style>
  #wrapper {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #333;
  }
  .item-row, .item-column {
    padding: 1em;
    width: 100%;
    overflow-x: auto;
  }
  .item-row ::-webkit-scrollbar-thumb,  .item-row ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0);
  }
  .item-row:hover ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .item-row--title, .item-column--title {
    font-weight: lighter;
    color: gray;
    text-transform: uppercase;
    margin-bottom: 1em;
    display: block;
  }
  .item-row--content {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .item-colum--content {
    display: flex;
    flex-direction: column;
  }
</style>
