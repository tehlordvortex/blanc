import { ipcRenderer as ipc } from 'electron'

const state = {
  status: 'stopped',
  queue: [],
  currentlyPlayingIndex: 0,
  currentlyPlaying: null,
  volume: 1,
  muted: false,
  playbackRate: 1,
  loop: 'all'
}

const mutations = {
  PLAY_MUSIC (state, music) {
    state.currentlyPlaying = music
    if (!state.queue.some(item => item.filePath === music.filePath)) {
      state.currentlyPlayingIndex = state.queue.push(music) - 1
    } else {
      state.currentlyPlayingIndex = state.queue.findIndex(item => item.filePath === music.filePath)
    }
    state.status = 'playing'
    ipc.send('tray-play-song', state.currentlyPlaying)
  },
  PAUSE_MUSIC (state) {
    state.status = 'paused'
    ipc.send('tray-pause-song')
  },
  STOP_MUSIC (state) {
    state.currentlyPlaying = null
    state.status = 'stopped'
  },
  RESUME_MUSIC (state) {
    state.status = 'playing'
    ipc.send('tray-resume-song')
  },
  CLEAR_QUEUE (state) {
    state.queue = []
    if (state.currentlyPlaying) {
      state.currentlyPlaying = null
      state.currentlyPlayingIndex = 0
      state.status = 'stopped'
    }
  },
  SET_QUEUE (state, queue) {
    state.queue = queue
  },
  QUEUE_SONGS (state, songs) {
    state.queue = state.queue.concat(songs)
  },
  REMOVE_FROM_QUEUE (state, music) {
    if (state.queue.some(item => item.filePath === music.filePath)) {
      state.queue = state.queue.filter(item => item.filePath !== music.filePath)
      if (state.currentlyPlaying && state.currentlyPlaying.filePath === music.filePath) {
        state.currentlyPlaying = null
        state.currentlyPlayingIndex = 0
        state.status = 'stopped'
      } else {
        state.currentlyPlayingIndex = state.queue.findIndex(item => item.filePath === music.filePath)
      }
    }
  },
  PLAY_NEXT (state, music) {
    if (!state.currentlyPlaying) state.queue.push(music)
    else state.queue.splice(state.currentlyPlayingIndex, 1, state.currentlyPlaying, music)
  },
  CHANGE_VOLUME (state, volume) {
    state.volume = volume
  },
  PLAY_NEXT_SONG (state, force) {
    if (state.loop !== 'all' && state.currentlyPlayingIndex !== state.queue.length - 1) {
      state.currentlyPlaying = state.queue[++state.currentlyPlayingIndex]
    } else if (state.loop === 'all' || force) {
      if (state.queue.length === 1) {
        state.currentlyPlaying = null
        state.currentlyPlaying = state.queue[0]
      } else {
        if (state.currentlyPlayingIndex === state.queue.length - 1) state.currentlyPlayingIndex = 0
        // else if (state.currentlyPlayingIndex === state.queue.length - 1) state.currentlyPlayingIndex = 0
        else state.currentlyPlayingIndex++
        state.currentlyPlaying = state.queue[state.currentlyPlayingIndex]
      }
    }
    ipc.send('tray-play-song', state.currentlyPlaying)
  },
  PLAY_PREVIOUS_SONG (state, force) {
    if (state.loop !== 'all' && state.currentlyPlayingIndex !== 0) {
      state.currentlyPlaying = state.queue[--state.currentlyPlayingIndex]
    } else if (state.loop === 'all' || force) {
      if (state.queue.length === 1) {
        state.currentlyPlaying = null
        state.currentlyPlaying = state.queue[0]
      } else {
        if (state.currentlyPlayingIndex === 0) state.currentlyPlayingIndex = state.queue.length - 1
        else state.currentlyPlayingIndex--
        state.currentlyPlaying = state.queue[state.currentlyPlayingIndex]
      }
    }
    ipc.send('tray-play-song', state.currentlyPlaying)
  },
  SET_LOOP (state, loop) {
    state.loop = loop
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  mutations,
  actions
}
