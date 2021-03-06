import Vue from 'vue'
import AlbumArtCard from './AlbumArtCard'
import chunk from 'lodash.chunk'
import { ALBUM_LINE_HEIGHT } from '@/lib/constants'

export default Vue.component('album-list', {
  data () {
    return {
      skip: 0
    }
  },
  props: {
    albums: Array,
    albumsPerLine: {
      type: Number,
      default: 4
    },
    lines: {
      type: Number,
      default: 5
    }
  },
  render (h) {
    let chunks = chunk(this.albums, this.albumsPerLine)
    let containerHeight = chunks.length * ALBUM_LINE_HEIGHT
    let style = {
      height: containerHeight + 'px'
    }
    let displayed = chunks.slice(this.skip, this.skip + this.lines)
    let lines = displayed.map((chunk, chunkIndex) => {
      let transformDistance = this.skip * ALBUM_LINE_HEIGHT
      let lineStyle = {
        // transfrom: `translate3d(0, ${transformDistance}px, 0)`
        transform: `translateY(${transformDistance}px)`
      }
      let line = chunk.map((album, albumIndex) => {
        return (
          <AlbumArtCard
            vertical
            artPath={album.art}
            onClick={(ev) => this.clicked(ev, album)}
            colors={album.colors}
            key={'album-list-' + album.name}
          >
            <span slot="title">{album.name}</span>
          </AlbumArtCard>
        )
      })
      return (
        <div
          class="album-list-line"
          style={lineStyle}
        >
          {line}
        </div>
      )
    })
    return (
      <div
        class="album-list-outer-container"
        onScroll={this.scrolled}
      >
        <div
          class="album-list-inner-container"
          style={style}
        >
          {lines}
        </div>
      </div>
    )
  },
  components: {
    AlbumArtCard
  },
  methods: {
    scrolled (ev) {
      this.skip = Math.floor(ev.target.scrollTop / ALBUM_LINE_HEIGHT)
    },
    clicked (ev, album) {
      this.$emit('click', {
        $event: ev,
        album
      })
    }
  }
})
