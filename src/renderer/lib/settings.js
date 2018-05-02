import settingsStore from 'electron-settings'

export const defaults = {
  volume: 1,
  muted: false,
  playbackRate: 1,
  libraries: []
}

class Settings {
  get volume () {
    return settingsStore.get('volume', defaults.volume)
  }
  set volume (v) {
    settingsStore.set('volume', v)
  }
  get muted () {
    return settingsStore.get('muted', defaults.muted)
  }
  set muted (m) {
    settingsStore.set('muted', m)
  }
  get playbackRate () {
    return settingsStore.get('playbackRate', defaults.playbackRate)
  }
  set playbackRate (pbr) {
    settingsStore.set('playbackRate', pbr)
  }
  get libraries () {
    return settingsStore.get('libraries', defaults.libraries)
  }
  set libraries (libs) {
    settingsStore.set('libraries', libs)
  }
  addLibrary (lib) {
    let libs = this.libraries
    if (libs.indexOf(lib) > -1) return
    libs.push(lib)
    this.libraries = libs
  }
  removeLibrary (lib) {
    let libs = this.libraries
    libs = libs.filter(l => l !== lib)
    this.libraries = libs
  }
}
export const settingsProvider = settingsStore
export default new Settings()
