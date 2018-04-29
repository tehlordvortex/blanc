<template>
  <transition-group
    name="animated-staggered-slide-in"
    :mode="mode"
    :appear="appear"
    :tag="tag"
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutLeft"
    @enter="stagger"
    @leave="stagger"
  >
    <slot></slot>
  </transition-group>
</template>

<script>
export default {
  name: 'staggered-slide-in-transition',
  props: {
    mode: {
      type: String,
      default: 'out-in'
    },
    appear: {
      type: Boolean,
      default: true
    },
    scale: {
      type: Number,
      default: 0.1
    },
    tag: {
      type: String,
      default: 'span'
    }
  },
  methods: {
    stagger (el, done) {
      let delay = el.dataset.staggeredIndex * this.scale
      el.style.animationDelay = el.dataset.staggeredIndex * this.scale + 's'
      setTimeout(done, 1000 + (delay * 1000))
    }
  }
}
</script>

<style>

</style>
