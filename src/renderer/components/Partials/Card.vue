<template>
  <div @click="clicked" class="card" :style="computedStyle">
    <div class="card--image" v-if="hasImage">
      <slot name="image"></slot>
    </div>
    <div class="card--contents" :class="center ? 'card--contents--center' : ''">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { getColors } from '@/lazy-loaders'

export default {
  name: 'card',
  props: {
    hasImage: Boolean,
    center: Boolean
  },
  methods: {
    clicked ($e) {
      this.$emit('click', $e)
    }
  },
  data: () => ({
    mounted: false
  }),
  mounted () {
    this.mounted = true
  },
  asyncComputed: {
    computedStyle () {
      // console.log(this.mounted, this.hasImage)
      if (!this.mounted) return Promise.resolve('')
      if (!this.hasImage) return Promise.resolve('')
      else {
        return new Promise((resolve, reject) => {
          let imgElement = this.$el.querySelector('.card--image img')
          if (imgElement) {
            return getColors(imgElement).then(colors => {
              if (colors) {
                return {
                  backgroundColor: colors.background,
                  color: colors.foreground
                }
              } else {
                return {}
              }
            })
          } else {
            resolve('')
          }
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
    /* min-height: 150px; */
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
    /* margin: 1em; */
    word-wrap: break-word;
    /* white-space: pre-wrap; */
    flex-grow: 1;
    /* width: 150px; */
  }
  .card--contents.card--contents--center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
