import { Color } from 'three'
import { GlText } from '@jniac/gl-text'
import { scene } from '../stage.js'

scene.background = new Color('#eee')

const glText = new GlText()
scene.add(glText)
glText.setTextAt(0, 'hello world\nglText here', {
  color: 'red',
})
glText.setTextAt(1, `abcdefgh`, {
  position: [0, 1.2, 0],
  color: 'yellow',
  background: 'blue',
})

glText.setTextAt(2, `Wie\ngeht's?`, {
  position: [0, -1.2, 0],
  color: 'yellow',
  background: 'blue',
})

document.body.append(GlText.getAtlasImg())

console.log('ready')

Object.assign(window, { GlText, glText })