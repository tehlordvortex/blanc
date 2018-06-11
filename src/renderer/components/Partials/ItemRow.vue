<template>
  <div class="item-row" :class="wrap ? 'item-row--wrap' : ''">
    <span class="item-row--title">
      {{ title }}
      <div class="item-row--title-side-content">
        <slot name="title-side-content"></slot>
      </div>
    </span>
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
    height: 3em;
    padding: 1em;
    display: block;
    background: #222;
    -webkit-app-region: drag;
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
    max-height: calc(100% - 3em);
  }
  .item-row--title-side-content {
    float: right;
  }
</style>
