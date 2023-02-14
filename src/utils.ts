import { BufferAttribute, BufferGeometry, Vector3 } from 'three'
import { atlasProps } from './atlas/props'

const _vector = new Vector3()

export const solvePositionDeclaration = (arg: Partial<Vector3> | number[]) => {
  if (Array.isArray(arg)) {
    const [x = 0, y = 0, z = 0] = arg
    return _vector.set(x, y, z)
  } else {
    const { x = 0, y = 0, z = 0 } = arg
    return _vector.set(x, y, z)
  }
}

/**
 * Map a text (string) to a flat array of character indices.
 * 
 * The output contains maxCol x maxRow values. To match the desired length (maxRow)
 * each line is filled with spaces.
 */
export const textToCharIndices = (text: string, maxCol: number, maxRow: number): { lineCount: number, lineLengths: number[], charIndices: number[] } => {
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => !!line)

  if (lines.length > maxRow) {
    console.log(`Extra lines are ignored (max row: ${maxRow}, line count: ${lines.length}).`)
  }

  const lineCount = lines.length

  while (lines.length < maxRow) {
    lines.push('')
  }

  const lineLengths = lines
    .map(line => line.length)

  for (const [index, line] of lines.entries()) {
    if (line.length > maxCol) {
      console.log(`Extra characters are ignored (max col: ${maxCol}, line length: ${line.length}).`)
      lines[index] = line.slice(0, maxCol)
    } else {
      lines[index] = line.padEnd(maxCol, ' ')
    }
  }

  const defaultIndex = atlasProps.chars.indexOf('#')
  const safeIndex = (index: number) => index === -1 ? defaultIndex : index
  const charIndices = lines
    .map(line => {
      return [...line]
        .map(char => safeIndex(atlasProps.chars.indexOf(char)))
    })
    .flat()

  return { lineCount, lineLengths, charIndices }
}

export const combineInt8 = (a: number, b: number, c: number) => {
  // return (a << 16) + (b << 8) + c
  return a * 65536 + b * 256 + c
}

export const extractInt8 = (n: number) => {
  const a = Math.floor(n / 65536)
  n -= a * 65536
  const b = Math.floor(n / 256)
  n -= b * 256
  return [a, b, n]
}

export const combineInt6 = (a: number, b: number, c: number, d: number) => {
  // return (a << 18) + (b << 12) + (c << 6) + d
  return a * 262144 + b * 4096 + c * 64 + d
}

export const extractInt6 = (n: number) => {
  const a = Math.floor(n / 262144)
  n -= a * 262144
  const b = Math.floor(n / 4096)
  n -= b * 4096
  const c = Math.floor(n / 64)
  n -= c * 64
  return [a, b, c, n]
}

export const createCharGeometry = (count: number): BufferGeometry => {
  const geometry = new BufferGeometry()
  const vertices = new Float32Array(count * 6 * 3)
  const vector = new Vector3()
  for (let i = 0; i < count; i++) {
    const stride = i * 6 * 3

    // 0,1 ——— 1,1
    //  │     ╱ │    
    //  │    ╱  │
    //  │   ╱   │
    //  │  ╱    │
    // 0,0 ——— 1,0

    // Triangle 1
    vector.set(0, 0, i).toArray(vertices, stride + 0)
    vector.set(1, 0, i).toArray(vertices, stride + 3)
    vector.set(1, 1, i).toArray(vertices, stride + 6)

    // Triangle 2
    vector.set(0, 0, i).toArray(vertices, stride + 9)
    vector.set(1, 1, i).toArray(vertices, stride + 12)
    vector.set(0, 1, i).toArray(vertices, stride + 15)
  }
  geometry.setAttribute('position', new BufferAttribute(vertices, 3))
  return geometry
}