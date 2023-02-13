import { DoubleSide, MeshBasicMaterial, NearestFilter, TextureLoader, Vector4 } from 'three'
import { atlasData } from './atlas/data'
import { ShaderForge } from './shader-forge/ShaderForge'

const atlasTexture = new TextureLoader().load(atlasData, texture => {
  // texture.minFilter = NearestFilter
  texture.generateMipmaps = false
})

export const material = new MeshBasicMaterial({
  transparent: true,
  map: atlasTexture,
  side: DoubleSide,
})

export const uniforms = {
  uTextSize: { value: new Vector4() },
}

material.onBeforeCompile = shader => {
  // console.log(shader.vertexShader)
  // console.log(shader.fragmentShader)
  ShaderForge.with(shader)
    .uniforms(uniforms)
    .varying({
      vTextColor: 'vec4',
      vBackgroundColor: 'vec4',
      vChars: 'mat4',
    })
    .vertex.top(/* glsl */`
      attribute mat4 chars;
      attribute vec4 textColor;
      attribute vec4 backgroundColor;
    `)
    .vertex.before('#include <uv_vertex>', /* glsl */`
      vTextColor = textColor;
      vBackgroundColor = backgroundColor;
      vChars = chars;
    `)
    .vertex.before('#include <project_vertex>', /* glsl */`
      // Resizing the (1/1) plane.
      transformed.xy *= uTextSize.zw;
    `)
    .fragment.top(/* glsl */`
      #define ATLAS_CHARS_PER_LINE 64.0
      #define INT8_PER_FLOAT32 3.0
    `)
    .fragment.replace('#include <map_fragment>', /* glsl */ `
      vec2 scaledUv = vUv * uTextSize.xy;
      vec2 slotPosition = floor(scaledUv); // Takes value as: (0, 0), (1, 0), (2, 0) etc.
      float slotIndex = (slotPosition.y * uTextSize.x + slotPosition.x) / INT8_PER_FLOAT32;
      int f = int(round(fract(slotIndex) * INT8_PER_FLOAT32));
      int x = int(mod(slotIndex, 4.0));
      int y = int(floor(slotIndex / 4.0));
      int i = int(vChars[y][x]);
      if (f == 0) {
        i = i >> 16;
      } else if (f == 1) {
        i = i >> 8;
      }
      i = i & 0xff;
      float charIndex = float(i);
      // float charIndex = vChars[y][x];
      vec2 charShift = vec2(mod(charIndex, ATLAS_CHARS_PER_LINE), -floor(charIndex / ATLAS_CHARS_PER_LINE));
      
      vec2 uv = scaledUv - slotPosition;
      uv += vec2(0.0, 1.0);
      uv += charShift;
      uv /= vec2(64.0, 256.0 / 120.0);
      float alpha = texture2D(map, uv).r;
      diffuseColor = mix(vBackgroundColor, vTextColor, alpha);
    `)
}
