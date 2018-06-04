<template>
  <div class="wrapper">
    <search-bar v-model="searchString" />
    <item-column title="all songs" class="fill-height">
      <sort-bar v-if="librarySorted" :criterias="sortCriterias" @sort="updateSort" />
      <template v-if="librarySorted">
        <!-- <div class="songs-wrapper"
        @scroll="scrolled"
        >
          <div
          v-if="libraryDisplayed"
          >
            <div :style="songListStyle">
              <div
                :style="item.style"
                v-for="(item, index) in libraryDisplayed" :key="'all-songs-' + item.filePath"
              >
                <music-item-tile
                  :itemObject="item"
                  @play="play(item)"
                  @pause="pause()"
                  :showArt="false"
                  :data-staggered-index="index"
                  @contextmenu="doContextMenu(item)"
                  >
                  <p>{{ item.title }}</p>
                  <p>{{ item.artist }}</p>
                  <p>{{ item.album }}</p>
                </music-item-tile>
              </div>
            </div>
          </div>
        </div> -->
        <song-list
          :songs="librarySorted"
          @play="play"
          @pause="pause"
          @contextmenu="doContextMenu"
        />
      </template>
      <loading-indicator v-else />
    </item-column>
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
    skipItems: 0
  }),
  computed: {
    librarySorted () {
      if (!this.library) return null
      let clone = this.library
      clone.sort(fieldCaseInsensitiveSort(this.sort.field, this.sort.order))
      if (this.searchString) {
        let lib = clone.filter(item => {
          let criteria = []
          if (item.title) criteria.push(item.title)
          if (item.artist) criteria.push(item.artist)
          if (item.artists) criteria.push(item.artists.join())
          if (item.album) criteria.push(item.album)
          if (item.fileName) criteria.push(item.fileName)
          return criteria.reduce((acc, c) => (c.toLowerCase().indexOf(this.searchString) > -1) || acc, false)
          // return filter.test(item.title) || filter.test(item.artist) || filter.test(item.artists.join()) || filter.test(item.album)
        })
        return lib
      } else {
        return clone
      }
    }
  },
  methods: {
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
    doContextMenu (item) {
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
    SongList
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
    padding: 0 1em;
  }

  .vertical-bar {
    background-color: turquoise !important;
  }
  .vertical-bar-internal {
    background-color: green !important;
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
  .vuescroll-vertical-scrollbar {
    min-height: 25px;
    transform: scaleY(0.5);
  }
  .vb > .vb-dragger {
    z-index: 5;
    width: 12px;
    min-height: 25px;
    right: 0;
  }

  .vb > .vb-dragger > .vb-dragger-styler {
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      -webkit-transform: rotate3d(0,0,0,0);
      transform: rotate3d(0,0,0,0);
      -webkit-transition:
          background-color 100ms ease-out,
          margin 100ms ease-out,
          height 100ms ease-out;
      transition:
          background-color 100ms ease-out,
          margin 100ms ease-out,
          height 100ms ease-out;
      background-color: rgba(48, 121, 244,.1);
      margin: 5px 5px 5px 0;
      border-radius: 20px;
      height: calc(100% - 10px);
      display: block;
  }

  .vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
      background-color: rgba(48, 121, 244,.3);
  }

  .vb > .vb-dragger:hover > .vb-dragger-styler {
      background-color: rgba(48, 121, 244,.5);
      margin: 0px;
      height: 100%;
  }

  .vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
      background-color: rgba(48, 121, 244,.5);
      margin: 0px;
      height: 100%;
  }

  .vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
      background-color: rgba(48, 121, 244,.5);
  }
</style>
