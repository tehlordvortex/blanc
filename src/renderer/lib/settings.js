import settingsStore from 'electron-settings'
import * as packageInfo from '../../../package.json'
export const defaults = {
  libraries: [],
  lastRunVersion: packageInfo.version
}

class Settings {
  get libraries () {
    return settingsStore.get('libraries', defaults.libraries)
  }
  set libraries (libs) {
    settingsStore.set('libraries', libs)
  }
  get version () {
    return packageInfo.version
  }
  get lastRunVersion () {
    return settingsStore.get('lastRunVersion', defaults.lastRunVersion)
  }
  set lastRunVersion (version) {
    settingsStore.set('lastRunVersion', version)
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
