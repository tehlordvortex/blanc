import { getColors, loadAlbumArt } from '@/lazy-loaders'
/*
 * Returns the base mixin for making the components react to item colors
 * @param {boolean} includeForeground - if true, will change the component's text/foreground color too
 * @param {string} fieldName - if specified, will use this.fieldName instead of currentlyPlaying
 */
export default function makeColorful (includeForeground = true, fieldName = null) {
  return {
    computed: {
      currentlyPlaying () {
        return this.$store.state.Music.currentlyPlaying
      },
      colorfulStyle () {
        if (!this.colors) return ''
        else {
          if (includeForeground) {
            return {
              background: this.colors.background,
              color: this.colors.foreground
            }
          } else {
            return {
              background: this.colors.background
            }
          }
        }
      }
    },
    asyncComputed: {
      colors () {
        let item = (fieldName) ? this[fieldName] : this.currentlyPlaying
        if (item) {
          if (item.colors) return item.colors
          else if (item.albumArt) return getColors(item.albumArt)
          else return loadAlbumArt(item.filePath).then(path => getColors(path))
        } else {
          return Promise.resolve('')
        }
      }
    }
  }
}
