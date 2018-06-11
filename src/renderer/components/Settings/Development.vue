<template>
  <item-column title="development" pad>
    <div class="input-group">
      <input type="checkbox" id="devmode" v-model="devmode" />
      <label for="devmode">Development Mode</label>
    </div>
  </item-column>
</template>

<script>
import ItemColumn from '@/components/Partials/ItemColumn'
export default {
  name: 'development-settings',
  props: {
    partial: Boolean
  },
  computed: {
    devmode: {
      set (val) {
        if (val) {
          this.$store.commit('ENABLE_DEV_MODE')
        } else {
          this.$store.commit('DISABLE_DEV_MODE')
        }
      },
      get () {
        return this.$store.state.App.devMode
      }
    }
  },
  components: {
    ItemColumn
  }
}
</script>

<style>
  .input-group {
    margin: 1em;
    display: flex;
    /* justify-content: space-between; */
  }
</style>
