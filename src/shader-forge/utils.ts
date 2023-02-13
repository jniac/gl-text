import { IUniform } from 'three'

/** Simple wrapper of code with marks that make easier to debug shader program. */
export const wrapCode = (code: string) => `\n// ShaderForge ->\n${code}\n// ShaderForge <-\n`

const getGlType = (value: any) => {
  if (typeof value === 'number') {
    return 'float'
  }
  if (value.isVector2) {
    return 'vec2'
  }
  if (value.isVector3 || value.isColor) {
    return 'vec3'
  }
  if (value.isVector4 || value.isQuaternion) {
    return 'vec4'
  }
  if (value.isMatrix3) {
    return 'mat3'
  }
  if (value.isMatrix4) {
    return 'mat4'
  }
  if (value.isTexture) {
    if (value.isCubeTexture) {
      return 'samplerCube'
    } else {
      return 'sampler2D'
    }
  }
  console.log(`unhandled value:`, value)
  throw new Error(`unhandled value: "${value?.constructor.name}"`)
}

/**
 * Converts a uniforms object to a glsl declaration string.
 * 
 * eg: 
 * > ```
 * > getUniformsDeclaration({ 
 * >   uTime: { value: 0 }, 
 * >   uSize: { value: new Vector2() },
 * > }) 
 * > ```
 *  
 * will output: 
 * 
 * > ```glsl
 * > uniform float uTime;
 * > uniform vec2 uSize;
 * > ```
 */
export const getUniformsDeclaration = (uniforms: Record<string, IUniform>): string => {
  return Object.entries(uniforms)
    .map(([name, uniform]) => `uniform ${getGlType(uniform.value)} ${name};`)
    .join('\n')
}
