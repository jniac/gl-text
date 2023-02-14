import { Color, TorusKnotGeometry, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, AmbientLight, DirectionalLight, Vector3, Matrix4, FogExp2, Group } from 'three'
import { GlText } from '@jniac/gl-text'
import { onFrame, scene } from '../shared/stage.js'

scene.background = new Color('#cff')
scene.fog = new FogExp2(scene.background.getHex(), 0.1)

const ambient = new AmbientLight('#ccf', .5)
scene.add(ambient)

const sun = new DirectionalLight('#ffc')
sun.position.set(5, 20, 10)
scene.add(sun)


const geometry = new TorusKnotGeometry(4, 1.6, 128, 32)
const positionAttr = geometry.getAttribute('position')
const normalAttr = geometry.getAttribute('normal')

const group = new Group()
scene.add(group)

const wireMesh = new Mesh(geometry, new MeshBasicMaterial({
  color: '#88f',
  wireframe: true,
}))
wireMesh.rotation.set(.3, .7, 0)
group.add(wireMesh)

onFrame(() => {
  group.rotateY(.001)
})

const glText = new GlText({
  count: positionAttr.count,
  col: 24,
  row: 2,
  cameraZOffset: .5,
  billboard: false,
  material: new MeshPhysicalMaterial(),
})
wireMesh.add(glText)

const vector = new Vector3()
const position = new Vector3()
const normal = new Vector3()
const up = new Vector3(0, 1, 0)
const matrix = new Matrix4()
for (let i = 0, max = positionAttr.count; i < max; i++) {
  position.set(
    positionAttr.getX(i),
    positionAttr.getY(i),
    positionAttr.getZ(i))
  normal.set(
    normalAttr.getX(i),
    normalAttr.getY(i),
    normalAttr.getZ(i))
  matrix
    .lookAt(position, vector.copy(position).sub(normal), up)
    .setPosition(position)
  glText.setTextAt(i, `vertex:\n${i}`, {
    color: '#fc0',
    background: '#66f',
    size: .5,
    matrix,
  })
}
