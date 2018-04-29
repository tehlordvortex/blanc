<template>
  <div class="card" :style="computedStyle">
    <div class="card--image">
      <img :src="image" class="album-art" />
    </div>
    <span class="card--contents">
      <slot></slot>
    </span>
  </div>
</template>

<script>
import * as Vibrant from 'node-vibrant'
// import * as VibrantWorker from 'node-vibrant/dist/vibrant.worker'
import { parseFile } from 'music-metadata'
import mime from 'mime'
import * as Color from 'color'

// console.log(VibrantWorker)

export default {
  name: 'card',
  props: {
    hasImage: Boolean,
    filePath: String
  },
  data: () => ({
    mounted: false
  }),
  mounted () {
    this.mounted = true
  },
  asyncComputed: {
    image () {
      return new Promise((resolve, reject) => {
        parseFile(this.filePath).then((metadata) => {
          if (metadata.common.picture) {
            let picture = metadata.common.picture[0]
            let dataURL = 'data:' + mime.getType(picture.format) + ';base64,'
            dataURL += picture.data.toString('base64')
            resolve(dataURL)
          }
        })
      })
    },
    computedStyle () {
      // console.log(this.mounted, this.image)
      if (!this.mounted) return Promise.resolve('')
      if (!this.image) return Promise.resolve('')
      else {
        return new Promise((resolve, reject) => {
          let base64Data = this.image.substr(this.image.indexOf(','))
          let buffer = Buffer.from(base64Data, 'base64')
          let v = Vibrant.from(buffer)
            // .useQuantizer(VibrantWorker)
            .getSwatches()
          v.then((swatches) => {
            // console.log(swatches)
            let swatch = swatches.Vibrant || swatches.Muted
            let bgColorText = 'rgb(' + swatch.getRgb().join(',') + ')'
            let cssString = 'background-color: ' + bgColorText + ';'
            let textColor = Color(bgColorText).isLight() ? Color.rgb(0, 0, 0) : Color.rgb(230, 230, 230)
            cssString += 'color: ' + textColor.rgb().string() + ';'
            resolve(cssString)
          })
        })
      }
    }
  }
}
</script>

<style scoped>
  .card {
    /* border-radius: 5px; */
    background-color: #666;
    color: white;
    margin: 1em;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: row;
    padding: 0;
    min-height: 150px;
    transition: box-shadow 0.3s;
  }
  
  .card:hover {
    box-shadow: 0 6px 10px 0 rgba(200, 200, 200, 0.2);
  }
  .card--image {
    height: 100%;
    padding: 0;
    flex-shrink: 0;
    flex-grow: 0;
  }
  .card--image img.album-art {
    height: 100%;
  }
  .card--contents {
    margin: 1em;
    word-wrap: break-word;
    /* white-space: pre-wrap; */
    flex-grow: 1;
    width: 150px;
  }
  .album-art {
    width: 128px;
    height: 100%;
    /* height: auto; */
  }
</style>
