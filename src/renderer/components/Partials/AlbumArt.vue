<template>
  <img :src="image" class="album-art" />
</template>

<script>
import { parseFile } from 'music-metadata/lib'
import * as mime from 'mime'
export default {
  name: 'album-art',
  props: {
    file: String
  },
  asyncComputed: {
    image () {
      return new Promise((resolve, reject) => {
        parseFile(this.file).then((metadata) => {
          if (metadata.common.picture) {
            let picture = metadata.common.picture[0]
            let dataURL = 'data:' + mime.getType(picture.format) + ';base64,'
            dataURL += picture.data.toString('base64')
            resolve(dataURL)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
  .album-art {
    width: 128px;
    height: auto;
  }
</style>
