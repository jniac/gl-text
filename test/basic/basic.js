import { Color, IcosahedronGeometry, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'
import { GlText } from '@jniac/gl-text'
import { scene } from '../shared/stage.js'
import './sphere.js'

scene.background = new Color('#eee')

const setPoint = (x = 0, y = 0, z = 0) => {
  const point = new Mesh(new IcosahedronGeometry(.1, 4), new MeshBasicMaterial({ color: 'white' }))
  point.position.set(x, y, z)
  scene.add(point)
}

const plane = new Mesh(new PlaneGeometry(4, 2), new MeshBasicMaterial({
  color: 'red',
  // wireframe: true,
}))
scene.add(plane)

const glText = new GlText({
  billboard: false,
  defaultSize: 4,
})
scene.add(glText)

setPoint(0, 0, 0)
glText.setTextAt(0, '12345678', {
  color: 'red',
  background: 'white',
})

setPoint(0, 2, 0)
glText.setTextAt(1, `abcdefgh\n1234`, {
  position: [0, 2, 0],
  color: 'yellow',
  background: 'blue',
  backgroundOpacity: .7,
})

setPoint(0, -2, 0)
glText.setTextAt(2, `Wie\ngeht's?`, {
  position: [0, -2, 0],
  color: 'blue',
})

// setPoint(0, -4, 0)
glText.setTextAt(3, `+-_=*/\\|\n[](){}<>` , {
// glText.setTextAt(3, `\\a` , {
  position: [0, -4, 0],
  color: 'blue',
  background: 'yellow',
  size: 2,
})

document.body.append(GlText.getAtlasImg())

Object.assign(window, { GlText, glText })
