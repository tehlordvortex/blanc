<template>
  <div class="list-row">
    <div class="list-row-content">
      <slot></slot>
    </div>
    <div class="list-row-actions">
      <slot name="actions"></slot>
      <material-button
        v-if="!hideDelete"
        flat
        @click="$emit('delete', $event)"
      >
        <i class="material-icons">clear</i>
      </material-button>
    </div>
  </div>
</template>

<script>
import MaterialButton from './MaterialButton'

export default {
  name: 'list-row',
  props: {
    hideDelete: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MaterialButton
  }
}
</script>

<style scoped>
  .list-row {
    width: 100%;
    display: flex;
    height: 1.8em;
    background-color: #222;
    margin: 5px 0;
  }
  .list-row .list-row-content {
    flex-grow: 1;
    padding: 5px 1em;
  }
  .list-row .list-row-content p {
    margin: 0;
  }
  .list-row .list-row-actions .button {
    padding: 2px 5px;
    margin: 0;
    height: 100%;
  }
</style>
