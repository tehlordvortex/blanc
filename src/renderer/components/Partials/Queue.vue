<template>
  <div class="queue">
    <div class="queue-header">
      <span>Queue</span>
      <span class="spacer"></span>
      <i
        class="material-icons close-button"
        @click.stop="clear"
      >
        delete
      </i>
      <i 
        class="material-icons close-button"
        v-if="!hideCloseButton"
        @click.stop="$emit('close', $event)"
        >
        clear
      </i>
    </div>
    <div class="queue-contents">
      <transition-group
        name="animated-slide-in"
        enter-active-class="animated slideInLeft"
        leave-active-class="animated slideOutRight p-abs"
        v-if="queue && queue.length > 0">
        <list-row
          v-for="(item, index) in queue"
          :key="index"
          @click="play(item)"
          @delete="remove(item)"
          class="slide-in-item"
        >
          <p>{{ item.title }} - {{ item.artist || 'Unknown Artist' }} - {{ item.album || 'Unknown Album' }}</p>
        </list-row>
      </transition-group>
      <p class="no-items-message" v-else>No items in queue.</p>
    </div>
  </div>
</template>

<script>
import ListRow from './ListRow'

export default {
  name: 'queue',
  data: () => ({}),
  props: {
    hideCloseButton: Boolean
  },
  computed: {
    queue () {
      return this.$store.state.Music.queue
    }
  },
  components: {
    ListRow
  },
  methods: {
    play (item) {
      this.$store.commit('PLAY_MUSIC', item)
    },
    remove (item) {
      this.$store.commit('REMOVE_FROM_QUEUE', item)
    },
    clear () {
      this.$store.commit('CLEAR_QUEUE')
    }
  }
}
</script>

<style scoped>
  .queue {
    display: flex;
    flex-direction: column;
    min-width: 300px;
    box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.3), -2px 0 5px 0 rgba(0, 0, 0, 0.3), 2px 0 5px 0 rgba(0, 0, 0, 0.3);
  }
  .spacer {
    flex-grow: 1;
  }
  .queue-header {
    flex-shrink: 0;
    display: flex;
    padding: 0 1em;
    align-items: center;
    height: 3em;
    background-color: #333;
    color: white;
  }
  .queue-contents {
    background-color: #666;
    color: white;
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0;
    width: 100%;
    max-height: 250px;
    position: relative;
    transition: all 0.5s ease;
  }
  .close-button {
    cursor: pointer;
    margin: 0 5px;
  }
  /* .moving {
    transition: transform 0.5s;
  } */
  .p-abs {
    z-index: 10;
  }
  .slide-in-item {
    display: inline-block;
    transition: all 0.5s ease;
    width: 100%;
  }
  .no-items-message {
    margin: 1em;
  }
</style>
