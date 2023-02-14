import { ColorRepresentation } from 'three';
import { Group } from 'three';
import { InstancedBufferAttribute } from 'three';
import { InstancedMesh } from 'three';
import { Material } from 'three';
import { Matrix4 } from 'three';
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

/** @public */
export declare type TextParams = Partial<typeof defaultTextParams>;

export { }
