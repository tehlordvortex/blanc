<template>
  <material-button
    to="/settings"
    icon
    flat
  >
    <i class="material-icons">settings</i>
  </material-button>
</template>

<script>
import MaterialButton from '@/components/Partials/MaterialButton'
export default {
  name: 'settings-popup-button',
  components: {
    MaterialButton
  }
}
</script>

<style lang="scss">
.tooltip {
  // ...

  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 0.01);
    }

    .popover-arrow {
      border-color: $color;
    }
  }
}
</style>
