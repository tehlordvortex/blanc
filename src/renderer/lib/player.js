import settings from './settings'

class Player {
  constructor (options) {
    this.options = {
      playbackRate: 1,
      volume: 1,
      muted: false,
      ...options
    }

    this.audio = null
    this.init()
  }

  init () {
    this.audio = new Audio()

    this.audio.muted = this.options.muted
    this.audio.playbackRate = this.options.playbackRate
    this.audio.defaultPlaybackRate = this.options.playbackRate
    this.audio.volume = this.options.volume
    this.audio.autoplay = false
  }

  destroy () {
    if (this.audio) {
      this.audio.pause()
      this.audio = null
    }
  }

  play () {
    if (this.audio) return this.audio.play()
    else return Promise.reject(new Error('audio has been destroyed'))
  }

  pause () {
    if (this.audio) return this.audio.pause() || Promise.resolve()
    else return Promise.reject(new Error('audio has been destroyed'))
  }

  stop () {
    if (this.audio) return this.audio.pause() || Promise.resolve()
    else return Promise.reject(new Error('audio has been destroyed'))
  }

  mute () {
    if (this.audio) this.audio.muted = true
    else throw new Error('audio has been destroyed')
  }

  unmute () {
    if (this.audio) this.audio.muted = false
    else throw new Error('audio has been destroyed')
  }

  getAudio () {
    return this.audio
  }

  getCurrentTime () {
    if (this.audio) return this.audio.currentTime
    else throw new Error('audio has been destroyed')
  }

  getDuration () {
    if (this.audio) return this.audio.duration
    else throw new Error('audio has been destroyed')
  }

  getSrc () {
    if (this.audio) return this.audio.src
    else throw new Error('audio has been destroyed')
  }

  getVolume () {
    if (this.audio) return this.audio.volume
    else throw new Error('audio has been destroyed')
  }

  setVolume (volume) {
    if (this.audio) this.audio.volume = volume
    else throw new Error('audio has been destroyed')
  }

  setSrc (src) {
    if (this.audio) this.audio.src = src
    else throw new Error('audio has been destroyed')
  }

  seek (newTime) {
    if (this.audio) this.audio.currentTime = newTime
    else throw new Error('audio has been destroyed')
  }

  isMuted () {
    if (this.audio) return this.audio.muted
    else throw new Error('audio has been destroyed')
  }

  isPaused () {
    if (this.audio) return this.audio.paused
    else throw new Error('audio has been destroyed')
  }
}

export default new Player({
  volume: settings.volume,
  playbackRate: settings.playbackRate,
  muted: settings.muted
})
