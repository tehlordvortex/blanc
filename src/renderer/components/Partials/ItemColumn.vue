<template>
  <div class="item-column">
    <span class="item-column--title">
      {{ title }}
      <div class="item-column--title-side-content">
        <slot name="title-side-content"></slot>
      </div>
    </span>
    <div class="item-column--content" :class="pad ? 'item-column--content-padded' : ''">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'item-column',
  props: {
    title: String,
    pad: Boolean
  }
}
</script>

<style scoped>
  .item-column {
    /* padding: 1em; */
    width: 100%;
    overflow-x: auto;
  }
  .item-column--title {
    font-weight: lighter;
    text-transform: uppercase;
    height: 3em;
    padding: 1em;
    display: block;
    background: #222;
    -webkit-app-region: drag;
  }
  .item-column--content {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: calc(100% - 3em);
  }
  .item-column--content.item-column--content-padded {
    padding: 1em;
  }
  .item-column--title-side-content {
    float: right;
  }
</style>
