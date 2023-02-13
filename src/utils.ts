import { Vector3 } from 'three'
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
 */
export const textToCharIndices = (text: string, maxCol: number, maxRow: number): number[] => {
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => !!line)
  if (lines.length > maxRow) {
    console.log(`Extra lines are ignored (max row: ${maxRow}, line count: ${lines.length}).`)
  }
  while (lines.length < maxRow) {
    lines.push('')
  }
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
  return lines
    .reverse() // Reverse here because of glsl direction.
    .map(line => {
      return [...line]
        .map(char => safeIndex(atlasProps.chars.indexOf(char)))
    })
    .flat()
}