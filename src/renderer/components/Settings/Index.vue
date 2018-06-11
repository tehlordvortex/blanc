<template>
  <router-view />
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
