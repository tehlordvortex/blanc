<template>
  <div class="item-row">
    <span class="item-row--title" v-text="title"></span>
    <div class="item-row--content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'item-row',
  props: {
    title: String
  }
}
</script>

<style scoped>
  .item-row {
    padding: 1em;
    width: 100%;
    overflow-x: auto;
  }
  .item-row ::-webkit-scrollbar-thumb,  .item-row ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0);
  }
  .item-row:hover ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .item-row--title {
    font-weight: lighter;
    text-transform: uppercase;
    margin-bottom: 1em;
    display: block;
  }
  .item-row--content {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
  }
</style>
