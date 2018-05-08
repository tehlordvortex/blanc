<template>
  <div class="item-row" :class="wrap ? 'item-row--wrap' : ''">
    <span class="item-row--title" v-text="title"></span>
    <div class="item-row--content" :class="wrap ? 'item-row--content--wrap' : ''" @scroll="$emit('scroll', $event)">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'item-row',
  props: {
    title: String,
    wrap: Boolean
  }
}
</script>

<style scoped>
  .item-row {
    padding: 1em;
    width: 100%;
    overflow-x: auto;
  }
  .item-row.item-row--wrap {
    height: 100%;
    overflow-x: hidden;
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
    height: 1em;
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
  .item-row--content--wrap {
    flex-wrap: wrap;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: calc(100% - 2em);
  }
</style>
