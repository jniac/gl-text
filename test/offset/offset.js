import { Color, TorusKnotGeometry, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, AmbientLight, DirectionalLight, Vector3 } from 'three'
import { GlText } from '@jniac/gl-text'
import { scene } from '../shared/stage.js'

scene.background = new Color('#eee')

const geometry = new TorusKnotGeometry(4, 1.6, 128, 32)
const positionAttr = geometry.getAttribute('position')

scene.add(new AmbientLight('#ccf', .5))

const sun = new DirectionalLight('#ffc')
sun.position.set(5, 20, 10)
scene.add(sun)

const wireSphere = new Mesh(geometry, new MeshBasicMaterial({
  color: 'white',
  wireframe: true,
}))
scene.add(wireSphere)

const plainSphere = new Mesh(geometry, new MeshPhysicalMaterial({
  color: '#3c9',
  polygonOffset: true,
  polygonOffsetFactor: 1,
}))
scene.add(plainSphere)

const glText = new GlText({
  maxCount: positionAttr.count,
  col: 24,
  row: 2,
  cameraZOffset: .5,
})
scene.add(glText)

const _vertex = new Vector3()
for (let i = 0, max = positionAttr.count; i < max; i++) {
  _vertex.set(
    positionAttr.getX(i),
    positionAttr.getY(i),
    positionAttr.getZ(i))
  glText.setTextAt(i, `vertex:\n${i}`, {
    position: _vertex,
    color: 'red',
    size: .35,
  })
}

document.querySelector('input').oninput = event => {
  const cameraZOffset = Number.parseFloat(event.currentTarget.value)
  glText.props.cameraZOffset = cameraZOffset
  document.querySelector('#cameraZOffset-value').innerHTML = cameraZOffset.toFixed(1)
}
