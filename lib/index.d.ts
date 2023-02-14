import { ColorRepresentation } from 'three';
import { Group } from 'three';
import { InstancedBufferAttribute } from 'three';
import { InstancedMesh } from 'three';
import { IUniform } from 'three';
import { Material } from 'three';
import { Matrix4 } from 'three';
import { Shader } from 'three';
import { Vector3 } from 'three';

/** @public */
export declare type ConstructorParams = Partial<typeof defaultConstructorParams>;

/**
 * @public
 */
export declare const defaultConstructorParams: {
    /**
     * The number of text that the object could display. Defaults to 2000.
     */
    count: number;
    col: number;
    row: number;
    billboard: boolean;
    charPerUnit: number;
    defaultSize: number;
    polygonOffsetFactor: number;
    polygonOffsetUnits: number;
    cameraZOffset: number;
    /**
     * By default GlText use an internal modified material derived from MeshBasicMaterial.
     * But here, it can be redefined by other choice, as MeshPhysicalMaterial, for
     * clearcoat and sheen effect!
     *
     * NOTE: The provided material will be transformed before compilation (onBeforeCompile
     * hook), and should not... already be compiled!
     */
    material: Material;
};

/**
 * @public
 * The default parameter for a text to be displayed.
 */
export declare const defaultTextParams: {
    /**
     * The position where the text should be displayed.
     *
     * NOTE: If the `position` does not provide enough controls, use the `matrix`
     * option.
     */
    position: Partial<Vector3> | number[];
    /**
     * If the `position` option is not enough, the `matrix` option allow to define
     * the full transform state of the instance.
     *
     * NOTE: When the matrix is used, you probably want to disable the billboard
     * mode from the constructor (`new GlText({ billboard: false })`)
     */
    matrix: Matrix4;
    /**
     * The color of the text. Defaults to white.
     */
    color: ColorRepresentation;
    colorOpacity: number;
    /**
     * The color of the background. For better readability?
     */
    background: ColorRepresentation;
    backgroundOpacity: number;
    /**
     * The size of the text. If not defined, it defaults to glText.props.defaultSize
     * (which can be defined in the constructor).
     */
    size: number;
};

/**
 * @public
 */
export declare class GlText extends Group {
    static getAtlasImg(): HTMLImageElement;
    static getAtlasChars(): string;
    props: {
        col: number;
        row: number;
        billboard: boolean;
        charPerUnit: number;
        defaultSize: number;
        polygonOffsetFactor: number;
        polygonOffsetUnits: number;
        cameraZOffset: number;
    };
    mesh: InstancedMesh;
    charsArray: Float32Array;
    charsAttribute: InstancedBufferAttribute;
    linesArray: Float32Array;
    linesAttribute: InstancedBufferAttribute;
    colorArray: Float32Array;
    colorAttribute: InstancedBufferAttribute;
    backgroundArray: Float32Array;
    backgroundAttribute: InstancedBufferAttribute;
    constructor(contructorParams?: ConstructorParams);
    setTextAt(index: number, text: string, option?: TextParams): this;
}

/**
 * @public
 * String manipulation on shader glsl code.
 *
 * The game is essentially to inject code before or after "shader chunk includes".
 * The list of shader chunks is [here](https://github.com/mrdoob/three.js/tree/master/src/renderers/shaders/ShaderChunk).
 */
export declare const ShaderForge: ShaderForgeType;

/** @public */
export declare type ShaderForgeChunkName = 'alphamap_fragment' | 'alphamap_pars_fragment' | 'alphatest_fragment' | 'alphatest_pars_fragment' | 'aomap_fragment' | 'aomap_pars_fragment' | 'begin_vertex' | 'beginnormal_vertex' | 'bsdfs' | 'iridescence_fragment' | 'bumpmap_pars_fragment' | 'clipping_planes_fragment' | 'clipping_planes_pars_fragment' | 'clipping_planes_pars_vertex' | 'clipping_planes_vertex' | 'color_fragment' | 'color_pars_fragment' | 'color_pars_vertex' | 'color_vertex' | 'common' | 'cube_uv_reflection_fragment' | 'defaultnormal_vertex' | 'displacementmap_pars_vertex' | 'displacementmap_vertex' | 'emissivemap_fragment' | 'emissivemap_pars_fragment' | 'encodings_fragment' | 'encodings_pars_fragment' | 'envmap_fragment' | 'envmap_common_pars_fragment' | 'envmap_pars_fragment' | 'envmap_pars_vertex' | 'envmap_vertex' | 'fog_vertex' | 'fog_pars_vertex' | 'fog_fragment' | 'fog_pars_fragment' | 'gradientmap_pars_fragment' | 'lightmap_fragment' | 'lightmap_pars_fragment' | 'lights_lambert_fragment' | 'lights_lambert_pars_fragment' | 'lights_pars_begin' | 'envmap_physical_pars_fragment' | 'lights_toon_fragment' | 'lights_toon_pars_fragment' | 'lights_phong_fragment' | 'lights_phong_pars_fragment' | 'lights_physical_fragment' | 'lights_physical_pars_fragment' | 'lights_fragment_begin' | 'lights_fragment_maps' | 'lights_fragment_end' | 'logdepthbuf_fragment' | 'logdepthbuf_pars_fragment' | 'logdepthbuf_pars_vertex' | 'logdepthbuf_vertex' | 'map_fragment' | 'map_pars_fragment' | 'map_particle_fragment' | 'map_particle_pars_fragment' | 'metalnessmap_fragment' | 'metalnessmap_pars_fragment' | 'morphcolor_vertex' | 'morphnormal_vertex' | 'morphtarget_pars_vertex' | 'morphtarget_vertex' | 'normal_fragment_begin' | 'normal_fragment_maps' | 'normal_pars_fragment' | 'normal_pars_vertex' | 'normal_vertex' | 'normalmap_pars_fragment' | 'clearcoat_normal_fragment_begin' | 'clearcoat_normal_fragment_maps' | 'clearcoat_pars_fragment' | 'iridescence_pars_fragment' | 'output_fragment' | 'packing' | 'premultiplied_alpha_fragment' | 'project_vertex' | 'dithering_fragment' | 'dithering_pars_fragment' | 'roughnessmap_fragment' | 'roughnessmap_pars_fragment' | 'shadowmap_pars_fragment' | 'shadowmap_pars_vertex' | 'shadowmap_vertex' | 'shadowmask_pars_fragment' | 'skinbase_vertex' | 'skinning_pars_vertex' | 'skinning_vertex' | 'skinnormal_vertex' | 'specularmap_fragment' | 'specularmap_pars_fragment' | 'tonemapping_fragment' | 'tonemapping_pars_fragment' | 'transmission_fragment' | 'transmission_pars_fragment' | 'uv_pars_fragment' | 'uv_pars_vertex' | 'uv_vertex' | 'uv2_pars_fragment' | 'uv2_pars_vertex' | 'uv2_vertex' | 'worldpos_vertex';

/** @public */
export declare type ShaderForgeGlType = 'float' | 'vec2' | 'vec3' | 'vec4' | 'mat3' | 'mat4' | 'samplerCube' | 'sampler2D';

/** @public */
export declare type ShaderForgeIncludePattern = `#include <${ShaderForgeChunkName}>`;

/** @public */
export declare type ShaderForgeType = {
    with: (shader: Shader) => ShaderForgeType;
    uniforms: (uniforms: Record<string, IUniform>) => ShaderForgeType;
    varying: (declaration: Record<string, ShaderForgeGlType>) => ShaderForgeType;
    vertex: ShaderForgeWrapperType;
    fragment: ShaderForgeWrapperType;
};

/** @public */
export declare type ShaderForgeWrapperType = {
    uniforms: (uniforms: Record<string, IUniform>) => ShaderForgeType;
    top: (code: string) => ShaderForgeType;
    beforeMain: (code: string) => ShaderForgeType;
    replace: (pattern: ShaderForgeIncludePattern, code: string) => ShaderForgeType;
    before: (pattern: ShaderForgeIncludePattern, code: string) => ShaderForgeType;
    after: (pattern: ShaderForgeIncludePattern, code: string) => ShaderForgeType;
};

/** @public */
export declare type TextParams = Partial<typeof defaultTextParams>;

export { }
