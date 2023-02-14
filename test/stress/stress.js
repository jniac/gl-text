import { Color, Vector3 } from 'three'
import { GlText } from '@jniac/gl-text'
import { scene } from '../shared/stage.js'
import { createKnot, createSphere } from '../shared/utils.js'

scene.background = new Color('#eee')

const sphere1 = createSphere()
const mesh2 = createKnot(200, 1024, 128)
const knot = createKnot()

const positionAttr1 = sphere1.geometry.attributes.position
const positionAttr2 = mesh2.geometry.attributes.position
const positionAttr3 = knot.geometry.attributes.position
const count1 = positionAttr1.count
const count2 = positionAttr2.count
const count3 = positionAttr3.count
const count = count1 + count2 + count3

const glText = new GlText({
  maxCount: count,
  col: 24,
  row: 2,
})
scene.add(glText)

const _vertex = new Vector3()

for (let i = 0, max = positionAttr1.count; i < max; i++) {
  _vertex.set(
    positionAttr1.getX(i),
    positionAttr1.getY(i),
    positionAttr1.getZ(i))
  glText.setTextAt(i, `v: ${i}`, {
    position: _vertex,
    color: 'red',
    size: 4,
  })
}

for (let i = 0, max = positionAttr2.count; i < max; i++) {
  _vertex.set(
    positionAttr2.getX(i),
    positionAttr2.getY(i),
    positionAttr2.getZ(i))
  glText.setTextAt(count1 + i, `outer torus knot\nvertex[:${i}:]`, {
    position: _vertex,
    color: 'blue',
    size: 2.5,
  })
}

for (let i = 0, max = positionAttr3.count; i < max; i++) {
  _vertex.set(
    positionAttr3.getX(i),
    positionAttr3.getY(i),
    positionAttr3.getZ(i))
  glText.setTextAt(count1 + count2 + i, `torus-knot\nvertex{${i}}`, {
    position: _vertex,
    color: 'blue',
    background: '#fc0',
    size: .2,
  })
}

console.log(count)

document.querySelector('#instance-count').innerHTML = count
document.querySelector('#col-row').innerHTML = `${glText.props.col}x${glText.props.row} chars`

Object.assign(window, { GlText, glText })

document.body.append(GlText.getAtlasImg())
