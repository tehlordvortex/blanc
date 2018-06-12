<template>
  <div class="list-row" :style="active ? colorfulStyle : ''">
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
import makeColorful from '../Mixins/Colorful'
export default {
  name: 'list-row',
  mixins: [makeColorful()],
  props: {
    hideDelete: {
      type: Boolean,
      default: false
    },
    active: {
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
    height: 2em;
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    /* margin: 5px 0; */
  }
  .list-row .list-row-content {
    /* flex-grow: 0; */
    padding: 5px 1em;
    cursor: pointer;
    width: 90%;
  }
  .list-row .list-row-content p {
    margin: 0;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .list-row .list-row-actions {
    /* flex-shrink: 0; */
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    /* align-self: flex-end; */
  }
  .list-row .list-row-actions .button {
    /* padding: 2px 5px; */
    margin: 0;
    height: 100%;
    max-width: 32px;
    align-items: center;
    justify-content: center;
    display: flex;
  }
</style>
