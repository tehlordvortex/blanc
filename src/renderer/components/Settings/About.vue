<template>
  <div class="wrapper" :class="partial ? 'no-fill-height' : ''">
    <item-column title="About" class="about-page">
      <div style="text-align: center">
        <h1>Blanc</h1>
        <h3>Version {{ appVersion }}</h3>
      </div>
      <p>Built with &lt;3 by <a href="#" @click="gotoGithub">tehlordvortex</a></p>
    </item-column>
  </div>
</template>

<script>
import ItemColumn from '@/components/Partials/ItemColumn'
import settings from '@/lib/settings'
export default {
  name: 'about-page',
  data: () => ({
    appVersion: settings.version
  }),
  props: {
    partial: Boolean
  },
  components: {
    ItemColumn
  },
  methods: {
    gotoGithub () {
      this.$electron.shell.openExternal('https://github.com/tehlordvortex')
    }
  }
}
</script>

<style>
  .about-page a, a:visited {
    color: #444;
  }
  .about-page a:hover {
    color: #555;
  }
</style>
