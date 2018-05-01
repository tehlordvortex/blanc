<template>
  <div class="item-column">
    <span class="item-column--title" v-text="title"></span>
    <div class="item-column--content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'item-column',
  props: {
    title: String
  }
}
</script>

<style scoped>
  .item-column {
    padding: 1em;
    width: 100%;
    overflow-x: auto;
  }
  .item-column--title {
    font-weight: lighter;
    color: gray;
    text-transform: uppercase;
    margin-bottom: 1em;
    display: block;
  }
  .item-column--content {
    display: flex;
    flex-direction: column;
    position: relative;
  }
</style>
