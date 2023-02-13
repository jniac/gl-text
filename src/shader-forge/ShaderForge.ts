import { Shader, IUniform } from 'three'
import { getUniformsDeclaration, wrapCode } from './utils'

let _shader: Shader | null = null
const getShaderWrapper = (key: 'vertexShader' | 'fragmentShader') => {
  const wrapper = {
    uniforms: (uniforms: Record<string, IUniform>) => {
      wrapper.top(getUniformsDeclaration(uniforms))
      Object.assign(_shader!.uniforms, uniforms)
      return ShaderForge
    },
    top: (code: string) => {
      _shader![key] = wrapCode(code) + _shader![key]
      return ShaderForge
    },
    beforeMain: (code: string) => {
      _shader![key] = _shader![key].replace('void main() {', `${wrapCode(code)}\nvoid main() {`)
    },
    replace: (pattern: string, code: string) => {
      _shader![key] = _shader![key].replace(pattern, wrapCode(code))
      return ShaderForge
    },
    before: (pattern: string, code: string) => {
      _shader![key] = _shader![key].replace(pattern, `${wrapCode(code)}\n${pattern}`)
      return ShaderForge
    },
    after: (pattern: string, code: string) => {
      _shader![key] = _shader![key].replace(pattern, `${pattern}\n${wrapCode(code)}`)
      return ShaderForge
    },
  }
  return wrapper
}

const vertex = getShaderWrapper('vertexShader')
const fragment = getShaderWrapper('fragmentShader')


/**
 * String manipulation on shader glsl code. 
 * 
 * The game is essentially to inject code before or after "shader chunk includes".
 * The list of shader chunks is [here](https://github.com/mrdoob/three.js/tree/master/src/renderers/shaders/ShaderChunk).
 */
const ShaderForge = {
  with: (shader: Shader) => {
    _shader = shader
    return ShaderForge
  },
  vertex,
  fragment,
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
}

export { ShaderForge }
