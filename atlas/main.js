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

const fontScale = .7

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

{
  const { width, height, chars, gridWidth, charWidth, charHeight } = atlasProps
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, width, height)
  
  ctx.fillStyle = 'white'
  ctx.font = `${(charHeight * fontScale).toFixed(1)}px "Fira Code"`
  ctx.textBaseline = 'top'
  for (const [index, char] of [...chars].entries()) {
    const x = index % gridWidth
    const y = (index - x) / gridWidth + (1 - fontScale) / 2
    ctx.fillText(char, x * charWidth, y * charHeight)
  }
}

document.querySelector('pre#chars').innerHTML = atlasProps.chars

const data = canvas.toDataURL()
document.querySelector('pre#data').innerHTML = `${data.slice(0, 100)}...`
console.log(data)
