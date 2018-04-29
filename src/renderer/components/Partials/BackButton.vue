<template>
  <div class="back-button" @click="goBack"><i class="material-icons">arrow_back</i></div>
</template>

<script>
export default {
  name: 'back-button',
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
  .back-button {
    position: absolute;
    width: 32px;
    height: 32px;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    top: 5px;
    left: 5px;
    cursor: pointer;
    transition: all 0.3s;
    color: white;
    padding: 2px;
    z-index: 1000;
  }
  .back-button:hover {
    background-color: rgba(120, 120, 120, 0.3);
  }
</style>
