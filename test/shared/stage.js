import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new Scene()
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.z = 8

const controls = new OrbitControls(camera, renderer.domElement)

const onFrameSet = new Set()
const onFrame = callback => {
  onFrameSet.add(callback)
  const destroy = () => onFrameSet.delete(callback)
  return { destroy }
}

function animate() {
  requestAnimationFrame(animate)
  for (const callback of onFrameSet) {
    callback()
  }

  renderer.render(scene, camera)
}

animate()

export {
  renderer,
  camera,
  scene,
  controls,
  onFrame,
}

Object.assign(window, {
  renderer,
  camera,
  scene,
  controls,
  onFrame,
})
