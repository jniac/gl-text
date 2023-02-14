import { Vector3 } from 'three'
import { GlText } from '@jniac/gl-text'
import { createSphere } from '../shared/utils.js'

const sphere = createSphere()
const positionAttr = sphere.geometry.getAttribute('position')

const glText = new GlText({
  count: positionAttr.count,
  col: 24,
  row: 2,
  cameraZOffset: .5,
})
scene.add(glText)

const vector = new Vector3()
for (let i = 0, max = positionAttr.count; i < max; i++) {
  vector.set(
    positionAttr.getX(i),
    positionAttr.getY(i),
    positionAttr.getZ(i))
  glText.setTextAt(i, `vertex:\n${i}`, {
    position: vector,
    color: '#da7eda',
    size: 2,
  })
}
