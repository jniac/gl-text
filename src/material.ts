import { DoubleSide, Matrix4, MeshBasicMaterial, NearestFilter, TextureLoader, Vector2, Vector4 } from 'three'
import { atlasData } from './atlas/data'
import { ShaderForge } from './shader-forge/ShaderForge'

const atlasTexture = new TextureLoader().load(atlasData)

export const material = new MeshBasicMaterial({
  transparent: true,
  map: atlasTexture,
  side: DoubleSide,
})

export const uniforms = {
  uCameraMatrix: { value: new Matrix4() },
  uTextSize: { value: new Vector4() },
  uCharSize: { value: new Vector4(64, 120, 64 / 120, 0) },
  uColRow: { value: new Vector2() },
}

material.onBeforeCompile = shader => {
  // console.log(shader.vertexShader)
  // console.log(shader.fragmentShader)

  ShaderForge.with(shader)
    .uniforms(uniforms)
    .varying({
      vTextColor: 'vec4',
      vBackgroundColor: 'vec4',
      vUvw: 'vec3',
    })
    .vertex.replace('#include <morphtarget_pars_vertex>', '')
    .vertex.top(/* glsl */`
      const float ATLAS_CHARS_PER_LINE = 64.0;
      const float INV_ATLAS_CHARS_PER_LINE = 1.0 / 64.0;
      const float INT8_PER_FLOAT32 = 3.0;
      const float THRESHOLD_1_3 = 0.33;
      const float THRESHOLD_2_3 = 0.66;

      attribute mat4 chars;
      attribute vec3 lines;
      attribute vec4 textColor;
      attribute vec4 backgroundColor;
    `)
    .vertex.beforeMain(/* glsl */`
      float uvScaleY(float y, float lineIndex) {
        y = 1.0 - y;
        y += lineIndex;
        y *= 120.0 / 256.0; 
        y = 1.0 - y;
        return y;
      }
      float extractFloat8(float n, float f) {
        float a = floor(n / 65536.0);
        n -= a * 65536.0;
        float b = floor(n / 256.0);
        n -= b * 256.0;
        float c = n;
        if (f > 0.66) {
          return c;
        }
        if (f > 0.33) {
          return b;
        }
        return a;
      }
      float extractFloat6(float n, float f) {
        float a = floor(n / 262144.0);
        n -= a * 262144.0;
        float b = floor(n / 4096.0);
        n -= b * 4096.0;
        float c = floor(n / 64.0);
        n -= c * 64.0;
        float d = n;
        if (f > 0.74) {
          return d;
        }
        if (f > 0.49) {
          return c;
        }
        if (f > 0.24) {
          return b;
        }
        return a;
      }
      float extractMat(in mat4 mat, float n) {
        float y = floor(n / 4.0);
        float x = n - y * 4.0;
        return mat[int(y)][int(x)];
      }
      vec2 indexToVec2(float i, float col) {
        float y = floor(i / col);
        float x = i - y * col;
        return vec2(x, y);
      }
    `)
    .vertex.before('#include <uv_vertex>', /* glsl */`
      vTextColor = textColor;
      vBackgroundColor = backgroundColor;

      float p = position.z / INT8_PER_FLOAT32;
      float n1 = extractMat(chars, p);
      float n2 = fract(p);
      float n3 = extractFloat8(n1, n2);
      vec2 offset = indexToVec2(n3, ATLAS_CHARS_PER_LINE);

      vUvw.x = (position.x + offset.x) * INV_ATLAS_CHARS_PER_LINE;
      vUvw.y = uvScaleY(position.y, offset.y);
      vUvw.z = position.z;
    `)
    .vertex.before('#include <project_vertex>', /* glsl */`
      float charAspect = uCharSize.z;
      float slotIndex = position.z;
      float lineIndex = floor(slotIndex / uColRow.x);
      float charIndex = slotIndex - lineIndex * uColRow.x;
      float lineLength = extractFloat6(lineIndex < 4.0 ? lines.x : lines.y, lineIndex / 4.0);

      if (charIndex < lineLength) {
        float tx = charIndex - lineLength * 0.5;
        // float ty = (uColRow.y - 1.0 - lineIndex) - uColRow.y * 0.5 - (uColRow.y - lines.z) * 0.5;
        float ty = lines.z * 0.5 - 1.0 - lineIndex;
        transformed.x = (transformed.x + tx * 0.9) * charAspect;
        transformed.y = (transformed.y + ty);
        transformed.z = 0.0;

        mat3 m = mat3(uCameraMatrix);
        transformed = m * transformed;
      } else {
        transformed = vec3(0.0);
      }
    `)
    .fragment.replace('#include <map_fragment>', /* glsl */ `
      float alpha = texture2D(map, vUvw.xy).r;
      diffuseColor = mix(vBackgroundColor, vTextColor, alpha);
      if (diffuseColor.a < .1) {
        discard;
      }
    `)
}
