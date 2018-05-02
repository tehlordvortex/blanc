<template>
  <div class="wrapper">
    <library-settings partial />
    <development-settings partial />
  </div>
</template>

<script>
import LibrarySettings from './Library'
import DevelopmentSettings from './Development'
export default {
  name: 'all-settings',
  components: {
    LibrarySettings,
    DevelopmentSettings
  }
}
</script>

<style scoped>

</style>
