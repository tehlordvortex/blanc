import Vibrant from 'node-vibrant'
// import Color from 'color'
import { readFileSync } from 'fs'

onmessage = (e) => {
  // console.log(e)
  if (e.data) {
    if (e.data.command && e.data.command === 'get-swatches') {
      setTimeout(getSwatches(e.data.image, e.data.invertColors, e.data.id), 0)
    }
  }
}

onerror = (e) => {
  console.log(e)
  postMessage({
    status: 'error'
  })
}

function getSwatches (image, invertColors, id) {
  let base64Data, buffer
  if (image.startsWith('data')) {
    base64Data = image.substr(image.indexOf(','))
    buffer = Buffer.from(base64Data, 'base64')
  } else {
    base64Data = null
    buffer = readFileSync(image.replace('file:///', ''))
  }
  let v
  try {
    v = Vibrant.from(buffer)
    // .useQuantizer(Quantizer.WebWorker)
      .getSwatches()
  } catch (e) {
    postMessage({
      status: 'error',
      error: e.toString(),
      id: id
    })
    return
  }
  v.then((swatches) => {
    // console.log(swatches)
    // let swatch = swatches.Vibrant || swatches.Muted
    // let bgColorText = 'rgb(' + swatch.getRgb().map(Math.floor).join(',') + ')'
    // let cssString = 'background-color: ' + bgColorText + ';'
    // let textColor = Color(bgColorText).isLight() ? Color.rgb(0, 0, 0) : Color.rgb(230, 230, 230)
    // if (invertColors) textColor = textColor.negate()
    // cssString += 'color: ' + textColor.rgb().string() + ';'
    buffer = null
    postMessage({
      status: 'resolved',
      result: (swatches.Vibrant || swatches.Muted).getRgb(),
      id: id
    })
  }).catch((e) => {
    buffer = null
    postMessage({
      status: 'error',
      error: e.toString(),
      id: id
    })
  })
}
