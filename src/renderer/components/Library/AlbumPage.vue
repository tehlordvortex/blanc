<template>
  <div class="album-page">
    <div class="album-banner" :style="computedStyle" v-if="album">
      <!-- <div class="back-button" @click="goBack"><i class="material-icons">arrow_back</i></div> -->
      <back-button />
      <div class="album-banner-fullimage" :style="computedImageStyle"></div>
      <div class="album-banner--text">
        <transition
          name="animated-slide-in"
          appear
          enter-active-class="animated slideInLeft"
          leave-active-class="animated slideOutLeft"
        >
          <div class="album-image" :style="computedImageStyle"></div>
        </transition>
        <transition
          name="animated-slide-in-up"
          appear
          enter-active-class="animated slideInUp"
          leave-active-class="animated slideOutDown"
        >
          <div class="album-details">
            <p>{{ album.name }}</p>
            <p>{{ albumArtists }}</p>
          </div>
        </transition>
      </div>
    </div>
    <!-- <div class="album-songs" v-if="album"> -->
      <transition-group
        name="animated-slide-in"
        appear
        enter-active-class="animated slideInLeft"
        leave-active-class="animated slideOutLeft"
        class="album-songs"
        tag="div"
        @enter="stagger"
        @leave="stagger"
        v-if="album"
      >
        <music-item-tile
          v-for="(item, index) in album.songs"
          :key="item.filePath"
          :showArt="false"
          :artPath="item.filePath"
          @play="play(item)"
          @pause="pause()"
          :active="musicStatus === 'playing' && currentlyPlaying && item.filePath === currentlyPlaying.filePath"
          :data-index="index"
        >
          {{ item.title || item.fileName }}
        </music-item-tile>
      </transition-group>
    <!-- </div> -->
  </div>
</template>

<script>
import { computedImage, computedImageStyle, computedStyle } from '@/lazy-loaders'
import db from '@/library.db'
import MusicItemTile from '@/components/Partials/MusicItemTile'
import BackButton from '@/components/Partials/BackButton'

export default {
  name: 'album-page',
  asyncComputed: {
    album () {
      return new Promise((resolve, reject) => {
        db.find({ album: this.$route.params.album }).exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            let album = {}
            album.name = this.$route.params.album
            album.artists = []
            album.artPath = res[0].filePath
            album.songs = res
            res.forEach(song => {
              song.artists.forEach(artist => {
                if (!album.artists.includes(artist)) {
                  album.artists.push(artist)
                }
              })
            })
            resolve(album)
          }
        })
      })
    },
    image () {
      if (!this.album) return Promise.resolve('')
      else return computedImage(this.album.artPath)()
    },
    computedImageStyle () {
      // console.log(this.image)
      if (!this.image) return Promise.resolve('')
      else return computedImageStyle(this.image)()
    },
    computedStyle () {
      if (!this.image) return Promise.resolve('')
      else return computedStyle(this.image, true, this.album.artPath)()
    }
  },
  computed: {
    albumArtists () {
      if (!this.album) {
        return ''
      } else {
        return this.album.artists.join(', ')
      }
    },
    currentlyPlaying () {
      return this.$store.state.Music.currentlyPlaying
    },
    musicStatus () {
      return this.$store.state.Music.status
    }
  },
  methods: {
    play (item) {
      console.log('Playing', item)
      this.$store.commit('PLAY_MUSIC', item)
    },
    pause () {
      this.$store.commit('PAUSE_MUSIC')
    },
    stagger (el, done) {
      let delay = el.dataset.index * 0.1
      el.style.animationDelay = el.dataset.index * 0.1 + 's'
      // console.log(el.dataset.index * 0.3)
      setTimeout(done, 1000 + (delay * 1000))
    }
  },
  components: {
    MusicItemTile,
    BackButton
  }
}
</script>

<style>
  .album-page {
    background: #333;
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: white;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;

  }
  .album-banner {
    min-height: 160px;
    background: #222;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .album-banner * {
    z-index: 0;
  }
  .album-banner--text {
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    padding: 5px;
    min-width: 300px;
    max-width: 400px;
  }
  .album-banner-fullimage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: blur(3px);
    z-index: 0;
    background-position: center;
    background-attachment: scroll;
  }

  .album-image {
    width: 128px;
    height: 128px;
    background-position: center;
    background-size: cover;
    margin: 0 1em;
    flex-shrink: 0;
  }

  .album-songs {
    width: 80%;
    height: 100%;
    margin: 0 auto;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .album-details p {
    max-width: 230px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

</style>
