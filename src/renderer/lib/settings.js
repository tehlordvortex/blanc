import settingsStore from 'electron-settings'

export const defaults = {
  libraries: []
}

class Settings {
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
