<template>
  <div class="wrapper">
    <transition
      mode="out-in"
      enter-active-class="animated slideInLeft"
      leave-active-class="animated slideOutRight"
      >
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {

}
</script>

<style>
  
</style>
