import * as process from 'process'

export function caseInsensitiveSort (a, b) {
  if (!a && !b) return 0
  if (!a && b) return -1
  else if (a && !b) return 1
  else {
    let al = a.toLowerCase().trim()
    let bl = b.toLowerCase().trim()
    if (al < bl) {
      return -1
    } else if (al > bl) {
      return 1
    } else {
      return 0
    }
  }
}

export function fieldCaseInsensitiveSort (field) {
  return (a, b) => {
    return caseInsensitiveSort(a[field], b[field])
  }
}

export function toFileURL (path) {
  let fileURL = 'file:///'
  if (process.platform === 'win32') {
    path = path.replace(/\\/g, '/')
  }
  fileURL += path.replace(/%/g, '%25').replace(/#/g, '%23').replace(/\?/g, '%3f')
  return fileURL
}
