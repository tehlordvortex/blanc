<template>
  <div class="wrapper no-scroll">
    <transition
      mode="out-in"
      enter-active-class="animated slideInLeft"
      leave-active-class="animated slideOutRight"
      >
      <template v-if="$route.params.album">
        <div class="album-page">
          <div class="album-banner" :style="computedStyle" v-if="album">
            <!-- <div class="back-button" @click="goBack"><i class="material-icons">arrow_back</i></div> -->
            <div class="album-banner-fullimage" :style="computedImageStyle"></div>
            <div class="album-banner--text">
              <transition
                name="animated-slide-in"
                appear
                enter-active-class="animated slideInLeft"
                leave-active-class="animated slideOutLeft"
              >
                <div class="album-image" :style="computedImageStyle">
                  <loading-indicator v-if="!computedImageStyle" />
                </div>
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
          <loading-indicator v-else />
          <!-- <div class="album-songs" v-if="album"> -->
            <transition-group
              name="animated-slide-in"
              appear
              mode="out-in"
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
                :item="item"
                @play="play(item)"
                @pause="pause()"
                :active="musicStatus === 'playing' && currentlyPlaying && item.filePath === currentlyPlaying.filePath"
                :data-index="index"
              >
                {{ item.title || item.fileName }}
              </music-item-tile>
            </transition-group>
        </div>
      </template>
      <template v-else>
        <item-column title="albums" class="fill-height">
          <template v-if="albumsDisplayed && albumsDisplayed.length > 0">
            <div class="albums-wrapper" @scroll="scrolled">
              <transition-group
                name="animated-slide-in"
                appear
                mode="in-out"
                appear-active-class="animated slideInLeft"
                tag="div"
                :style="albumListStyle"
                @enter="stagger"
                @leave="disappear"
              >
                <album-art-card
                  @click="gotoAlbum(item)"
                  v-for="(item, index) in albumsDisplayed"
                  v-if="item.name"
                  :key="'albums-' + item.name"
                  hasImage
                  :data-index="index"
                  :colors="item.colors"
                  :style="item.style"
                  :artPath="item.art">
                  <p slot="title">{{ item.name }}</p>
                  <p>{{ item.artists.join(", ") }}</p>
                </album-art-card>
              </transition-group>
            </div>
          </template>
          <loading-indicator v-else />
        </item-column>
      </template>
    </transition>
    <!-- </div> -->
  </div>
</template>

<script>
import { getBackgroundImageCSS, toColorString } from '@/lazy-loaders'
// import db from '@/library.db'
import MusicItemTile from '@/components/Partials/MusicItemTile'
import AlbumArtCard from '@/components/Partials/AlbumArtCard'
import BackButton from '@/components/Partials/BackButton'
import ItemColumn from '@/components/Partials/ItemColumn'
import LoadingIndicator from '@/components/Partials/LoadingIndicator'
import { ALBUM_TILE_HEIGHT, ALBUM_CHUNKS_TO_DISPLAY, ALBUM_TILES_PER_CHUNK, ALBUM_CHUNK_HEIGHT } from '@/lib/constants'
import chunk from 'lodash.chunk'
import flatten from 'lodash.flatten'

export default {
  name: 'album-page',
  data: () => ({
    skipItems: 0
  }),
  asyncComputed: {
    album () {
      if (!this.$route.params.album) return null
      if (!this.albums) return null
      else return this.albums.find(album => album.name === this.$route.params.album)
    },
    image () {
      if (!this.album) return Promise.resolve('')
      // console.log(this.album.art)
      return 'file://' + this.album.art
    },
    computedImageStyle () {
      // console.log(this.image)
      if (!this.image) return Promise.resolve('')
      else return getBackgroundImageCSS(this.image)
    },
    computedStyle () {
      if (!this.album) return Promise.resolve('')
      else if (!this.album.colors) return ''
      else return toColorString(this.album.colors)
    },
    albums () {
      return [...this.$store.state.Library.albums].sort((a, b) => {
        if (!a.name && !b.name) return 0
        if (!a.name && b.name) return -1
        else if (a.name && !b.name) return 1
        else {
          let al = a.name.toLowerCase().trim()
          let bl = b.name.toLowerCase().trim()
          if (al < bl) {
            return -1
          } else if (al > bl) {
            return 1
          } else {
            return 0
          }
        }
      })
    },
    albumsDisplayed () {
      if (!this.albums) return null
      let chunks = chunk(this.albums, ALBUM_TILES_PER_CHUNK)
      return flatten(chunks.splice(this.skipItems, ALBUM_CHUNKS_TO_DISPLAY)).map((item, index) => {
        let transformDistance = (this.skipItems * ALBUM_TILE_HEIGHT * ALBUM_TILES_PER_CHUNK)
        return { ...item, style: { transform: `translate3d(0, ${transformDistance}px, 0)` } }
      })
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
    },
    albumListStyle () {
      if (!this.albums) return null
      return {
        height: (this.albums.length * ALBUM_TILE_HEIGHT) + 'px !important'
      }
    }
  },
  watch: {
    '$route' () {
      this.skipItems = 0
    }
  },
  methods: {
    scrolled (ev) {
      // console.log(ev)
      // console.log(ev)
      this.skipItems = Math.floor(ev.target.scrollTop / ALBUM_CHUNK_HEIGHT)
      console.log(this.skipItems)
    },
    play (item) {
      // console.log('Playing', item)
      this.$store.commit('SET_QUEUE', this.album.songs)
      this.$store.commit('PLAY_MUSIC', item)
    },
    pause () {
      this.$store.commit('PAUSE_MUSIC')
    },
    stagger (el, done) {
      // console.log('staggering')
      let delay = el.dataset.index * 0.03
      el.style.animationDelay = el.dataset.index * 0.1 + 's'
      // console.log(el.dataset.index * 0.3)
      setTimeout(done, 1000 + (delay * 1000))
    },
    disappear (el, done) {
      done()
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
  components: {
    MusicItemTile,
    BackButton,
    AlbumArtCard,
    ItemColumn,
    LoadingIndicator
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
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: row;
    padding: 5px;
    min-width: 300px;
    max-width: 400px;
    margin: 1em;
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
    max-width: 200px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: white;
  }

  .albums-wrapper {
    width: 100%;
    max-height: 100%;
    height: 100%;
    overflow: auto;
    position: relative;
  }

  .fill-height {
    height: 100%;
  }
  .no-padding {
    padding: 0;
  }

</style>
