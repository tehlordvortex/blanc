<template>
  <div :class="className"
    @dragover.stop.prevent="$emit('dragover', $event)"
    @drop.stop.prevent="$emit('drop', $event)"
    @click.stop.prevent="$emit('click', $event)"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'dropzone',
  props: {
    itemClass: {
      type: String,
      default: 'dropzone'
    }
  },
  computed: {
    className () {
      return this.itemClass
    }
  }
}
</script>

<style scoped>
  .dropzone {
    width: 100%;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 4px dashed #666;
    color: white;
    cursor: pointer;
  }
</style>
