import { Color, ColorRepresentation, Group, InstancedBufferAttribute, InstancedMesh, Material, Matrix4, Vector3 } from 'three'
import { atlasData } from './atlas/data'
import { atlasProps } from './atlas/props'
import { MAX_CHARS_PER_LINE, MAX_LINES } from './constants'
import { defaultMaterial, transformMaterial, uniforms } from './material'
import { ShaderForge } from './shader-forge'
import { combineInt6, combineInt8, createCharGeometry, solvePositionDeclaration, textToCharIndices } from './utils'

const _color = new Color()
const _matrix = new Matrix4()
const _vector = new Vector3()

/**
 * @public
 */
export const defaultConstructorParams = {
  /**
   * The number of text that the object could display. Defaults to 2000.
   */
  count: 2000,
  col: 12,
  row: 2,
  billboard: true,
  charPerUnit: 8,
  defaultSize: 1,
  polygonOffsetFactor: -1,
  polygonOffsetUnits: -10,
  cameraZOffset: 0,
  /**
   * By default GlText use an internal modified material derived from MeshBasicMaterial.
   * But here, it can be redefined by other choice, as MeshPhysicalMaterial, for
   * clearcoat and sheen effect!
   * 
   * NOTE: The provided material will be transformed before compilation (onBeforeCompile 
   * hook), and should not... already be compiled!
   */
  material: <Material> null!,
}

/** @public */
export type ConstructorParams = Partial<typeof defaultConstructorParams>

/**
 * @public
 * The default parameter for a text to be displayed.
 */
export const defaultTextParams = {
  /** 
   * The position where the text should be displayed.
   * 
   * NOTE: If the `position` does not provide enough controls, use the `matrix` 
   * option.
   */
  position: <Partial<Vector3> | number[]> { x: 0, y: 0, z: 0 },
  /** 
   * If the `position` option is not enough, the `matrix` option allow to define 
   * the full transform state of the instance.
   * 
   * NOTE: When the matrix is used, you probably want to disable the billboard 
   * mode from the constructor (`new GlText({ billboard: false })`)
   */
  matrix: <Matrix4> undefined!,
  /**
   * The color of the text. Defaults to white.
   */
  color: <ColorRepresentation> 'white',
  colorOpacity: 1,
  /**
   * The color of the background. For better readability?
   */
  background: <ColorRepresentation> undefined!,
  backgroundOpacity: 0,
  /** 
   * The size of the text. If not defined, it defaults to glText.props.defaultSize 
   * (which can be defined in the constructor).
   */
  size: 1,
}

/** @public */
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

  static get ShaderForge() {
    return ShaderForge
  }

  props: {
    col: number
    row: number
    billboard: boolean
    charPerUnit: number
    defaultSize: number
    polygonOffsetFactor: number
    polygonOffsetUnits: number
    cameraZOffset: number    
  }

  mesh: InstancedMesh
  charsArray: Float32Array
  charsAttribute: InstancedBufferAttribute
  linesArray: Float32Array
  linesAttribute: InstancedBufferAttribute
  colorArray: Float32Array
  colorAttribute: InstancedBufferAttribute
  backgroundArray: Float32Array
  backgroundAttribute: InstancedBufferAttribute

  constructor(contructorParams: ConstructorParams = {}) {
    super()

    const {
      count,
      col: userCol,
      row: userRow,
      billboard,
      charPerUnit,
      defaultSize,
      polygonOffsetFactor,
      polygonOffsetUnits,
      cameraZOffset,
      material,
    } = {
      ...defaultConstructorParams,
      ...contructorParams,
    }

    const col = Math.min(userCol, MAX_CHARS_PER_LINE)
    const row = Math.min(userRow, MAX_LINES)

    this.props = {
      col,
      row,
      billboard,
      charPerUnit,
      defaultSize,
      polygonOffsetFactor,
      polygonOffsetUnits,
      cameraZOffset,      
    }

    const finalMaterial = material ? transformMaterial(material) : defaultMaterial
    
    const geometry = createCharGeometry(col * row)
    const mesh = new InstancedMesh(geometry, finalMaterial, count)
    this.add(mesh)

    // uniforms update:
    mesh.onBeforeRender = (renderer, scene, camera) => {
      const {
        col,
        row,
        billboard,
        charPerUnit,
        polygonOffsetFactor,
        polygonOffsetUnits,
        cameraZOffset,      
      } = this.props
      uniforms.uCameraMatrix.value.copy(camera.matrixWorld)
      uniforms.uBillboard.value = billboard ? 1 : 0
      uniforms.uCharPerUnit.value = charPerUnit
      uniforms.uCameraZOffset.value = cameraZOffset
      uniforms.uColRow.value.set(col, row)
      finalMaterial.polygonOffsetFactor = polygonOffsetFactor
      finalMaterial.polygonOffsetUnits = polygonOffsetUnits
    }

    const charsArray = new Float32Array(count * 16)
    const charsAttribute = new InstancedBufferAttribute(charsArray, 16)
    geometry.setAttribute('chars', charsAttribute)

    const linesArray = new Float32Array(count * 3)
    const linesAttribute = new InstancedBufferAttribute(linesArray, 3)
    geometry.setAttribute('lines', linesAttribute)

    const colorArray = new Float32Array(count * 4)
    const colorAttribute = new InstancedBufferAttribute(colorArray, 4)
    geometry.setAttribute('textColor', colorAttribute)

    const backgroundArray = new Float32Array(count * 4)
    const backgroundAttribute = new InstancedBufferAttribute(backgroundArray, 4)
    geometry.setAttribute('backgroundColor', backgroundAttribute)

    this.mesh = mesh
    this.charsArray = charsArray
    this.charsAttribute = charsAttribute
    this.linesArray = linesArray
    this.linesAttribute = linesAttribute
    this.colorArray = colorArray
    this.colorAttribute = colorAttribute
    this.backgroundArray = backgroundArray
    this.backgroundAttribute = backgroundAttribute
  }

  setTextAt(index: number, text: string, option: TextParams = {}): this {
    const {
      position,
      matrix,
      color = defaultTextParams.color,
      colorOpacity = defaultTextParams.colorOpacity,
      background,
      backgroundOpacity = option.background ? 1 : 0,
      size = this.props.defaultSize,
    } = option

    this.mesh.getMatrixAt(index, _matrix)
    if (matrix) {
      _matrix.copy(matrix)
    }
    if (position) {
      _matrix.setPosition(solvePositionDeclaration(position))
    }
    _matrix.scale(_vector.setScalar(size))
    this.mesh.setMatrixAt(index, _matrix)

    {
      // Update the "textColor" attribute.
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
      // Update the "backgroundColor" attribute.
      _color.set(background ?? color)
      const stride = index * 4
      const array = this.backgroundArray
      array[stride + 0] = _color.r
      array[stride + 1] = _color.g
      array[stride + 2] = _color.b
      array[stride + 3] = backgroundOpacity
      this.backgroundAttribute.needsUpdate = true
    }

    {
      // Update the "chars" & "lines" attributes.
      const { col, row } = this.props
      const { charsArray, linesArray } = this
      const { lineCount, lineLengths, charIndices } = textToCharIndices(text, col, row)
      const stride1 = index * 16
      for (let i = 0; i < 16; i++) {
        const stride2 = i * 3
        const a = charIndices[stride2 + 0] ?? 0
        const b = charIndices[stride2 + 1] ?? 0
        const c = charIndices[stride2 + 2] ?? 0
        charsArray[stride1 + i] = combineInt8(a, b, c)
      }
      this.charsAttribute.needsUpdate = true

      const x = combineInt6(lineLengths[0] ?? 0, lineLengths[1] ?? 0, lineLengths[2] ?? 0, lineLengths[3] ?? 0)
      const y = combineInt6(lineLengths[4] ?? 0, lineLengths[5] ?? 0, lineLengths[6] ?? 0, lineLengths[7] ?? 0)
      linesArray[index * 3 + 0] = x
      linesArray[index * 3 + 1] = y
      linesArray[index * 3 + 2] = lineCount
      this.linesAttribute.needsUpdate = true
    }
    
    return this
  }
}
