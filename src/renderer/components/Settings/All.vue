<template>
  <div class="wrapper">
    <library-settings partial />
    <development-settings partial />
    <about-page partial />
  </div>
</template>

<script>
import LibrarySettings from './Library'
import DevelopmentSettings from './Development'
import AboutPage from './About'
export default {
  name: 'all-settings',
  components: {
    LibrarySettings,
    DevelopmentSettings,
    AboutPage
  }
}
</script>

<style scoped>

</style>
