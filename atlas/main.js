import './ui.js'

const atlasProps = {
  chars: [
    '0123456789',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'abcdefghijklmnopqrstuvwxyz',
    ' #@&$%?!',
    'éèàìñ',
    '"\'',
    '+-_=*/\\|[](){}<>',
    '.;:,',
    '×',
  ].join(''),
  width: 4096,
  height: 256,
  gridWidth: 64,
  gridHeight: 2,
  charWidth: 64,
  charHeight: 120,
  charAspect: 64 / 120,
}

const fontScale = 0.7

const svg = document.querySelector('svg')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = atlasProps.width
canvas.height = atlasProps.height
svg.setAttributeNS(null, 'viewBox', `0 0 ${atlasProps.width} ${atlasProps.height}`)

{
  const { width, height, chars, gridWidth, charWidth, charHeight } = atlasProps
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = 'white'
  ctx.font = `${(charHeight * fontScale).toFixed(1)}px "Fira Code"`
  ctx.textBaseline = 'top'
  for (const [index, char] of [...chars].entries()) {
    const x = index % gridWidth
    const y = (index - x) / gridWidth
    ctx.fillText(char, x * charWidth, (y  + (1 - fontScale) / 2) * charHeight)

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttributeNS(null, 'fill', 'none')
    rect.setAttributeNS(null, 'stroke', '#0ff')
    rect.setAttributeNS(null, 'x', x * charWidth)
    rect.setAttributeNS(null, 'y', y * charHeight)
    rect.setAttributeNS(null, 'width', charWidth)
    rect.setAttributeNS(null, 'height', charHeight)
    svg.append(rect)
  }
}

document.querySelector('pre#chars').innerHTML = atlasProps.chars

const data = canvas.toDataURL()
document.querySelector('pre#data').innerHTML = `${data.slice(0, 100)}...`

export const getData = (id) => {
  switch (id) {
    case 'chars': {
      return atlasProps.chars
    }
    case 'data': {
      return data
    }
  }
}


