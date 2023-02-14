import { Shader, IUniform } from 'three'
import { ChunkName } from './ChunkName'
import { GlType } from './GlType'
import { getUniformsDeclaration, wrapCode } from './utils'

/** @public */
type IncludePattern = `#include <${ChunkName}>`

/** @public */
type WrapperType = {
  uniforms: (uniforms: Record<string, IUniform>) => ShaderForgeType
  top: (code: string) => ShaderForgeType
  beforeMain: (code: string) => ShaderForgeType
  replace: (pattern: IncludePattern, code: string) => ShaderForgeType
  before: (pattern: IncludePattern, code: string) => ShaderForgeType
  after: (pattern: IncludePattern, code: string) => ShaderForgeType  
}

/** @public */
type ShaderForgeType = {
  with: (shader: Shader) => ShaderForgeType
  uniforms: (uniforms: Record<string, IUniform>) => ShaderForgeType
  varying: (declaration: Record<string, GlType>) => ShaderForgeType
  vertex: WrapperType
  fragment: WrapperType
}

let _shader: Shader | null = null
const getShaderWrapper = (key: 'vertexShader' | 'fragmentShader'): WrapperType => {
  const wrapper: WrapperType = {
    uniforms: uniforms => {
      wrapper.top(getUniformsDeclaration(uniforms))
      Object.assign(_shader!.uniforms, uniforms)
      return ShaderForge
    },
    top: code => {
      _shader![key] = wrapCode(code) + _shader![key]
      return ShaderForge
    },
    beforeMain: code => {
      _shader![key] = _shader![key].replace('void main() {', `${wrapCode(code)}\nvoid main() {`)
      return ShaderForge
    },
    replace: (pattern, code) => {
      _shader![key] = _shader![key].replace(pattern, wrapCode(code))
      return ShaderForge
    },
    before: (pattern, code) => {
      _shader![key] = _shader![key].replace(pattern, `${wrapCode(code)}\n${pattern}`)
      return ShaderForge
    },
    after: (pattern, code) => {
      _shader![key] = _shader![key].replace(pattern, `${pattern}\n${wrapCode(code)}`)
      return ShaderForge
    },
  }
  return wrapper
}

const vertex = getShaderWrapper('vertexShader')
const fragment = getShaderWrapper('fragmentShader')

/**
 * @public
 * String manipulation on shader glsl code. 
 * 
 * The game is essentially to inject code before or after "shader chunk includes".
 * The list of shader chunks is [here](https://github.com/mrdoob/three.js/tree/master/src/renderers/shaders/ShaderChunk).
 */
const ShaderForge: ShaderForgeType = {
  with: (shader: Shader) => {
    _shader = shader
    return ShaderForge
  },
  uniforms: (uniforms: Record<string, IUniform>) => {
    const code = getUniformsDeclaration(uniforms)
    vertex.top(code)
    fragment.top(code)
    Object.assign(_shader!.uniforms, uniforms)
    return ShaderForge
  },
  varying: (declaration: Record<string, string>) => {
    const str = Object
      .entries(declaration)
      .map(([key, type]) => `varying ${type} ${key};`)
      .join('\n')
    vertex.before('#include <common>', str)
    fragment.before('#include <common>', str)
    return ShaderForge
  },
  vertex,
  fragment,
}

export { 
  ShaderForge, 
  ShaderForgeType,
  WrapperType,
  IncludePattern,
}
