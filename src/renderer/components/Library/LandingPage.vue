<template>
  <div id="wrapper">
    <div class="item-row">
      <span class="item-row--title">Albums</span>
      <div class="item-row--content" v-if="albums">
        <album-art-card v-for="item in albums" :key="'albums-' + item.filePath" hasImage :filePath="item.filePath">
          {{ item.name }}
        </album-art-card>
        <card>
          <p>View all</p>
        </card>
      </div>
    </div>
    <div class="item-column">
      <span class="item-column--title">All Songs</span>
      <div class="item-column--content" v-if="library">
        <album-art-card
          v-for="item in library" :key="'all-songs-' + item.title"
          :filePath="item.filePath"
          @click="play(item)">
          {{ item.title }}
        </album-art-card>
      </div>
    </div>
  </div>
</template>

<script>
// import AlbumArt from '@/components/Partials/AlbumArt'
import AlbumArtCard from '@/components/Partials/AlbumArtCard'
import Card from '@/components/Partials/Card'
import db from '@/library.db'

export default {
  name: 'library-landing-page',
  data: () => ({
  }),
  asyncComputed: {
    library () {
      return new Promise((resolve, reject) => {
        db.find({ title: { $ne: '' } }).sort({ title: 1 }).exec((err, res) => {
          if (err) reject(err)
          else resolve(res.slice(0, 20))
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
            resolve(albums.sort((a, b) => a.name < b.name).slice(0, 20))
          }
        })
      })
    }
  },
  components: {
    Card,
    AlbumArtCard
  },
  methods: {
    play (item) {
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
  .item-row--title, .item-column--title {
    font-weight: lighter;
    color: gray;
    text-transform: uppercase;
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
