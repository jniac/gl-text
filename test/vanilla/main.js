import { Color, IcosahedronGeometry, Mesh, MeshBasicMaterial } from 'three'
import { GlText } from '@jniac/gl-text'
import { scene } from '../shared/stage.js'
import { createSphere } from '../shared/utils.js'

scene.background = new Color('#eee')

createSphere()

const setPoint = (x = 0, y = 0, z = 0) => {
  const point = new Mesh(new IcosahedronGeometry(.1, 4), new MeshBasicMaterial({ color: 'white' }))
  point.position.set(x, y, z)
  scene.add(point)
}

const glText = new GlText()
scene.add(glText)

setPoint(0, 0, 0)
glText.setTextAt(0, 'hello world', {
  color: 'red',
})

setPoint(0, 2, 0)
glText.setTextAt(1, `abcdefgh\n1234`, {
  position: [0, 2, 0],
  color: 'yellow',
  background: 'blue',
})

setPoint(0, -2, 0)
glText.setTextAt(2, `Wie\ngeht's?`, {
  position: [0, -2, 0],
  color: 'yellow',
  background: 'blue',
})

// setPoint(0, -4, 0)
glText.setTextAt(3, `+-_=*/\\|\n[](){}<>` , {
// glText.setTextAt(3, `\\a` , {
  position: [0, -4, 0],
  color: 'blue',
  background: 'yellow',
  size: .5,
})

document.body.append(GlText.getAtlasImg())

Object.assign(window, { GlText, glText })
