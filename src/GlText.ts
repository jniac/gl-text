import { Color, ColorRepresentation, Group, InstancedBufferAttribute, InstancedMesh, Matrix4, PlaneGeometry, Vector3 } from 'three'
import { atlasData } from './atlas/data'
import { atlasProps } from './atlas/props'
import { material, uniforms } from './material'
import { solvePositionDeclaration, textToCharIndices } from './utils'

// 3 and not 4, because the maximum integer a float 32 (ieee754) can define is 2^24 (https://stackoverflow.com/a/3793950/4696005)
const INT8_PER_FLOAT32 = 3

const _color = new Color()
const _matrix = new Matrix4()

/**
 * @public
 * The default parameter for a text to be displayed.
 */
export const defaultTextParams = {
  /** The position where the text should be displayed. */
  position: <Partial<Vector3> | number[]> { x: 0, y: 0, z: 0 },
  color: <ColorRepresentation> 'white',
  colorOpacity: 1,
  background: <ColorRepresentation> undefined!,
  backgroundOpacity: 0,
  size: 1,
}

/**
 * @public
 */
export type TextParams = Partial<typeof defaultTextParams>

/**
 * @public
 */
export class GlText extends Group {
  static getAtlasImg(): HTMLImageElement {
    const img = document.createElement('img')
    img.className = 'GlText-Atlas'
    img.src = atlasData
    return img
  }

  static getAtlasChars(): string {
    return atlasProps.chars 
  }

  props: {
    col: number
    row: number
    itemSize: number
  }

  mesh: InstancedMesh
  charsArray: Float32Array
  charsAttribute: InstancedBufferAttribute
  colorArray: Float32Array
  colorAttribute: InstancedBufferAttribute
  backgroundArray: Float32Array
  backgroundAttribute: InstancedBufferAttribute

  constructor({
    maxCount = 2000,
    col = 12,
    row = 2,
    charPerUnit = 8,
  } = {}) {
    super()

    const geometry = new PlaneGeometry()
    const mesh = new InstancedMesh(geometry, material, maxCount)
    this.add(mesh)
    mesh.onBeforeRender = () => {
      uniforms.uTextSize.value.set(col, row, col / charPerUnit, row / charPerUnit / atlasProps.charAspect)
    }

    const itemSize = Math.ceil(col * row / INT8_PER_FLOAT32)
    const charsArray = new Float32Array(maxCount * 16)
    const charsAttribute = new InstancedBufferAttribute(charsArray, 16)
    geometry.setAttribute('chars', charsAttribute)

    const colorArray = new Float32Array(maxCount * 4)
    const colorAttribute = new InstancedBufferAttribute(colorArray, 4)
    geometry.setAttribute('textColor', colorAttribute)

    const backgroundArray = new Float32Array(maxCount * 4)
    const backgroundAttribute = new InstancedBufferAttribute(backgroundArray, 4)
    geometry.setAttribute('backgroundColor', backgroundAttribute)

    this.props = { col, row, itemSize }
    this.mesh = mesh
    this.charsArray = charsArray
    this.charsAttribute = charsAttribute
    this.colorArray = colorArray
    this.colorAttribute = colorAttribute
    this.backgroundArray = backgroundArray
    this.backgroundAttribute = backgroundAttribute
  }

  setTextAt(index: number, text: string, option: TextParams = {}): this {
    const {
      position = defaultTextParams.position,
      color = defaultTextParams.color,
      colorOpacity = defaultTextParams.colorOpacity,
      background,
      backgroundOpacity = option.background ? 1 : 0,
    } = option

    this.mesh.getMatrixAt(index, _matrix)
    _matrix.setPosition(solvePositionDeclaration(position))
    this.mesh.setMatrixAt(index, _matrix)

    {
      _color.set(color)
      const stride = index * 4
      const array = this.colorArray
      array[stride + 0] = _color.r
      array[stride + 1] = _color.g
      array[stride + 2] = _color.b
      array[stride + 3] = colorOpacity
      this.colorAttribute.needsUpdate = true
    }
    
    {
      _color.set(background ?? color)
      const stride = index * 4
      const array = this.backgroundArray
      array[stride + 0] = _color.r
      array[stride + 1] = _color.g
      array[stride + 2] = _color.b
      array[stride + 3] = backgroundOpacity
      this.backgroundAttribute.needsUpdate = true
    }

    const { col, row } = this.props
    const charIndices = textToCharIndices(text, col, row)
    {
      const stride1 = index * 16
      const array = this.charsArray
      for (let i = 0; i < 16; i++) {
        const stride2 = i * 3
        const a = charIndices[stride2 + 0]
        const b = charIndices[stride2 + 1]
        const c = charIndices[stride2 + 2]
        const abc = (a << 16) + (b << 8) + c
        array[stride1 + i] = abc
      }
      this.charsAttribute.needsUpdate = true
      // DEBUG:
      // const check = [...array.slice(stride, stride + 16)].map(i => {
      //   const a = i >> 16
      //   const b = (i >> 8) & 0xff
      //   const c = i & 0xff
      //   return [atlasProps.chars[a], atlasProps.chars[b], atlasProps.chars[c]].join('')
      // }).join('')
      // console.log(text, check)
    }

    return this
  }
}
