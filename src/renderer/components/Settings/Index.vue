<template>
  <div class="wrapper">
    <transition
      mode="out-in"
      enter-active-class="animated slideInLeft"
      leave-active-class="animated slideOutRight"
      >
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'settings',
  mounted () {
    this.$store.commit('SHOW_CHROME')
    this.$store.commit('SHOW_MUSIC_BAR')
  }
}
</script>

<style>
  
</style>
