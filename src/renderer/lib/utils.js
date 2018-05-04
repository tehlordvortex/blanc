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
