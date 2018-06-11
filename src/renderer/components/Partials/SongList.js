import Vue from 'vue'
import MusicItemTile from './MusicItemTile'
// import chunk from 'lodash.chunk'
// import flatten from 'lodash.flatten'
import { TILE_HEIGHT, CHUNK_HEIGHT, TILES_PER_CHUNK, CHUNKS_TO_DISPLAY } from '../../lib/constants'
// import { throttle } from 'underscore'

export default Vue.component('song-list', {
  data () {
    return {
      skip: 0
    }
  },
  props: {
    songs: Array
  },
  render (h) {
    // let chunks = chunk(this.songs, TILES_PER_CHUNK)
    let containerHeight = (this.songs.length / TILES_PER_CHUNK) * CHUNK_HEIGHT
    // if (chunks.length > 1) {
    //   containerHeight += (chunks.length - 1) * CHUNK_HEIGHT
    // }
    // containerHeight += (chunks[chunks.length - 1].length / TILE_HEIGHT) * CHUNK_HEIGHT
    let style = {
      height: containerHeight + 'px'
    }
    let displayed = this.songs.slice(this.skip * TILES_PER_CHUNK, (this.skip * TILES_PER_CHUNK) + CHUNKS_TO_DISPLAY * TILES_PER_CHUNK)
    let tiles = displayed.map((item, itemIndex) => {
      let transformDistance = (this.skip * TILE_HEIGHT * TILES_PER_CHUNK)
      let tileStyle = {
        // transfrom: `translate3d(0, ${transformDistance}px, 0)`
        transform: `translateY(${transformDistance}px)`
      }
      return (
        <div
          style={tileStyle}
        >
          <MusicItemTile
            itemObject={item}
            onPlay={() => this.onPlay(item)}
            onPause={() => this.onPause()}
            onContextmenu={() => this.onContextMenu(item)}
            compact
          >
            <p>{item.title}</p>
            <p>{item.artist}</p>
            <p>{item.album}</p>
          </MusicItemTile>
        </div>
      )
    })
    return (
      <div
        class="songs-wrapper"
        onScroll={this.scrolled.bind(this)}
      >
        <div
          style={style}
        >
          {tiles}
        </div>
      </div>
    )
  },
  components: {
    MusicItemTile
  },
  methods: {
    scrolled (ev) {
      this.skip = Math.floor(ev.target.scrollTop / CHUNK_HEIGHT)
    },
    onPlay (item) {
      this.$emit('play', item)
    },
    onPause () {
      this.$emit('pause')
    },
    onContextMenu (item) {
      this.$emit('contextmenu', item)
    }
  }
})
