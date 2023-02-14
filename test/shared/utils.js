import { Mesh, MeshBasicMaterial, SphereGeometry, TorusKnotGeometry } from 'three'

export const createSphere = (radius = 50, widthSegments = 64, heightSegments = 32) => {
  const geometry = new SphereGeometry(radius, widthSegments, heightSegments)
  const material = new MeshBasicMaterial({
    color: '#da7eda',
    wireframe: true,
  })
  const mesh = new Mesh(geometry, material)
  scene.add(mesh)
  return mesh
}

export const createKnot = (scale = 4, tubularSegments = 256, radialSegments = 32) => {
  const geometry = new TorusKnotGeometry(1 * scale, .4 * scale, tubularSegments, radialSegments)
  const material = new MeshBasicMaterial({
    color: '#111582',
    wireframe: true,
  })
  const mesh = new Mesh(geometry, material)
  scene.add(mesh)
  return mesh
}
