import { getData } from './main.js'

for (const div of document.querySelectorAll('.copy-button')) {
  div.onclick = async () => {
    const id = div.previousElementSibling.id
    const str = getData(id)
    await navigator.clipboard.writeText(str)
    div.previousElementSibling.classList.add('hidden')
    window.requestAnimationFrame(() => {
      div.previousElementSibling.classList.remove('hidden')
    })
  }
}

const clamp01 = x => x < 0 ? 0 : x > 1 ? 1 : x
const lerp = (a, b, t) => a + (b - a) * clamp01(t)
const inverseLerp = (a, b, t) => clamp01((t - a) / (b - a))
const canvasWrapper = document.querySelector('.canvas-wrapper')
canvasWrapper.onpointermove = event => {
  const rect = canvasWrapper.getBoundingClientRect()
  const scale = 2
  const padding = 10
  const x = inverseLerp(rect.left + padding, rect.right - padding, event.clientX)
  const y = inverseLerp(rect.top + padding, rect.bottom - padding, event.clientY)
  const min = -(scale - 1) / 2
  const max = (scale - 1) / 2
  const tx = lerp(max, min, x) * 100
  const ty = lerp(max, min, y) * 100
  canvasWrapper.firstElementChild.style.transform = `translate(${tx.toFixed(1)}%, ${ty.toFixed(1)}%) scale(${scale})`
}
canvasWrapper.onpointerleave = () => {
  canvasWrapper.firstElementChild.style.transform = ``
}
