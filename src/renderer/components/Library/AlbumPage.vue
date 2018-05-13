<template>
  <div class="wrapper">
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
            <div class="album-banner-others">
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
                    <p>{{ album.songs.length }} Song{{ album.songs.length > 1 ? 's': '' }}</p>
                    <p>
                      <material-button
                        rounded
                        flat
                        :style="computedStyle"
                        @click="playAlbum"
                      >
                        play
                      </material-button>
                    </p>
                  </div>
                </transition>
              </div>
              <div class="album-banner--songs">
                <transition
                  mode="out-in"
                  appear
                  enter-active-class="animated slideInUp"
                  leave-active-class="animated slideOutDown"
                >
                  <card class="raise-up">
                    <!-- <material-button
                      big
                      icon
                      class="album-play-button"
                      :style="computedStyle"
                      @click="playAlbum"
                    >
                      <i class="material-icons">play_arrow</i>
                    </material-button> -->
                    <music-item-tile
                      v-for="(item, index) in albumSongs"
                      :key="item.filePath"
                      :showArt="false"
                      :item="item"
                      @play="play(item)"
                      @pause="pause()"
                      @contextmenu="doContextMenu(item)"
                      :active="musicStatus === 'playing' && currentlyPlaying && item.filePath === currentlyPlaying.filePath"
                      :data-index="index"
                    >
                      <p>{{ item.title }}</p>
                      <p>{{ item.artist }}</p>
                    </music-item-tile>
                  </card>
                </transition>
              </div>
            </div>
          </div>
          <loading-indicator v-else />
          <!-- <div class="album-songs" v-if="album"> -->
          <!-- <div class="album-songs-wrapper">
          </div> -->
        </div>
      </template>
      <template v-else>
        <item-row wrap title="albums" @scroll="scrolled">
          <search-bar v-model="searchString" />
          <album-list
            :albums="albums"
            v-if="albums" 
            @click="albumClicked"
            />
          <loading-indicator v-else />
        </item-row>
      </template>
    </transition>
    <!-- </div> -->
  </div>
</template>

<script>
import { getBackgroundImageCSS, toColorString, getSongs } from '@/lazy-loaders'
// import db from '@/library.db'
import MusicItemTile from '@/components/Partials/MusicItemTile'
import AlbumArtCard from '@/components/Partials/AlbumArtCard'
import BackButton from '@/components/Partials/BackButton'
import ItemRow from '@/components/Partials/ItemRow'
import LoadingIndicator from '@/components/Partials/LoadingIndicator'
import SearchBar from '@/components/Partials/SearchBar'
import { ALBUM_LINE_HEIGHT } from '@/lib/constants'
// import { ALBUM_LINE_HEIGHT, ALBUM_CHUNKS_TO_DISPLAY, ALBUM_LINES_PER_CHUNK, ALBUM_CHUNK_HEIGHT } from '@/lib/constants'
// import chunk from 'lodash.chunk'
// import flatten from 'lodash.flatten'
import { toFileURL } from '@/lib/utils'
import AlbumList from '@/components/Partials/AlbumList'
import MaterialButton from '@/components/Partials/MaterialButton'
import Card from '@/components/Partials/Card'
import { remote } from 'electron'

const Menu = remote.Menu

export default {
  name: 'album-page',
  data: () => ({
    skipItems: 0,
    searchString: ''
  }),
  asyncComputed: {
    album () {
      if (!this.$route.params.album) return null
      if (!this.albums) return null
      else return this.albums.find(album => album.name === this.$route.params.album)
    },
    albumSongs () {
      if (!this.album) return null
      else return getSongs(this.album.name)
    },
    image () {
      if (!this.album) return Promise.resolve('')
      // console.log(this.album.art)
      if (!this.album.art) return Promise.resolve('static/albumart-placeholder.png')
      else return toFileURL(this.album.art)
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
      return this.$store.state.Library.albums.filter(album => {
        let criteria = []
        criteria.push(album.name)
        criteria = criteria.concat(album.artists)
        return criteria.reduce((acc, c) => (c.toLowerCase().indexOf(this.searchString) > -1) || acc, false)
      })
    },
    albumsDisplayed () {
      if (!this.albums) return null
      // let chunks = chunk(this.albums, ALBUM_LINES_PER_CHUNK)
      // return flatten(chunks.splice(this.skipItems, ALBUM_CHUNKS_TO_DISPLAY)).map((item, index) => {
      //   let transformDistance = (this.skipItems * ALBUM_CHUNK_HEIGHT)
      //   return { ...item, style: { transform: `translate3d(0, ${transformDistance}px, 0)` } }
      // })
      return this.albums
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
    albumsPerLine () {
      console.log(this.$refs)
      if (!this.$refs.flexWrap) return null
      return Math.floor(this.$refs.flexWrap.clientWidth / (128 + 16 * 2))
    },
    albumListStyle () {
      if (!this.albums) return null
      if (!this.albumsPerLine) return null
      return {
        height: (Math.floor(this.albums.length / this.albumsPerLine) * ALBUM_LINE_HEIGHT) + 'px !important'
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
      console.log(ev.target.scrollTop)
      // console.log(ALBUM_CHUNK_HEIGHT)
      // this.skipItems = Math.floor(Math.max(0, (ev.target.scrollTop - 16 * 4)) / ALBUM_CHUNK_HEIGHT)
      // console.log(this.skipItems)
    },
    play (item) {
      // console.log('Playing', item)
      // this.$store.commit('SET_QUEUE', this.albumSongs)
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
    },
    albumClicked (data) {
      this.gotoAlbum(data.album)
    },
    playAlbum () {
      if (!this.albumSongs) return
      this.$store.commit('SET_QUEUE', this.albumSongs)
      this.$store.commit('PLAY_MUSIC', this.albumSongs[0])
    },
    doContextMenu (item) {
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
            this.$store.commit('QUEUE_SONGS', this.albumSongs)
          }
        }
      ]
      const menu = Menu.buildFromTemplate(template)
      menu.popup({async: true})
    }
  },
  components: {
    MusicItemTile,
    BackButton,
    AlbumArtCard,
    ItemRow,
    LoadingIndicator,
    SearchBar,
    AlbumList,
    MaterialButton,
    Card
  }
}
</script>

<style lang="scss">
  @mixin max-width($width) {
    @media screen and (max-width: $width) {
        @content;
    }
  }
  .album-page {
    width: 100%;
    height: 100%;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .album-banner {
    height: 100%;
    max-height: 100%;
    // justify-content: center;
    position: relative;
    // overflow: auto;
  }
  .album-banner * {
    z-index: 50;
  }
  .album-banner--text {
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: row;
    padding: 5px;
    min-width: 300px;
    height: 138px;
    margin: 1em;
    z-index: 50;
    flex-shrink: 0;
  }
  .album-banner--text  p {
    margin: 5px;
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
    background-size: cover;
    background-repeat: no-repeat;
  }

  .album-banner-others {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 1em;
  }

  .album-image {
    width: 128px;
    height: 128px;
    background-position: center;
    background-size: cover;
    margin-right: 5px;
    flex-shrink: 0;
  }

  .album-songs {
    height: 100%;
    width: 100%;
    /* margin: 0 auto; */
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 0;
  }

  .album-details p {
    max-width: 150px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: white;
  }

  .albums-wrapper {
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow: auto;
    position: relative;
  }

  .fill-height {
    height: 100%;
  }
  .no-padding {
    padding: 0;
  }

  .flex-wrap > div {
    display: inline-block;
  }
  .flex-wrap {
    width: 90%;
    margin: 0 5%;
    display: flex;
    flex-wrap: wrap;
    // justify-content: center;
  }
  /* .flex-wrap {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: flex-start;
    align-self: flex-start;
    justify-self: flex-start;
  } */

  .album-list-outer-container {
    width: 100%;
    height: inherit;
    // max-height: 90%;
    overflow: auto;
    position: relative;
    padding-bottom: 2.5em; /* avoid cutting off shadows for the very last items */
  }
  .album-list-line {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .album-play-button {
    position: absolute;
    z-index: 1200;
    color: white !important;
    right: 1em;
    top: -32px;
  }

  .album-songs-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow: auto;
    z-index: 50;
    padding-top: 200px;
    // padding-bottom: 1em; 
    pointer-events: none;
  }
  .raise-up {
    width: 100%;
    margin: 0 !important;
    background-color: #222 !important;
  }

  .album-banner--songs {
    width: 70%;
    flex-shrink: 1;
    box-shadow: 0 25px 30px rgba(0, 0, 0, 0.3) !important;
  }

</style>
