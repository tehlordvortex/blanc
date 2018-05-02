<template>
  <div class="list-row">
    <div class="list-row-content" @click.stop="$emit('click', $event)">
      <slot></slot>
    </div>
    <div class="list-row-actions">
      <slot name="actions"></slot>
      <material-button
        v-if="!hideDelete"
        flat
        @click.stop="$emit('delete', $event)"
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
    min-height: 2em;
    background-color: #222;
    color: white;
    /* margin: 5px 0; */
  }
  .list-row .list-row-content {
    flex-grow: 1;
    padding: 5px 1em;
    cursor: pointer;
  }
  .list-row .list-row-content p {
    margin: 0;
  }
  .list-row .list-row-actions .button {
    padding: 2px 5px;
    margin: 0;
    height: 100%;
    align-items: center;
    display: flex;
  }
</style>
