import { ColorRepresentation } from 'three';
import { Group } from 'three';
import { InstancedBufferAttribute } from 'three';
import { InstancedMesh } from 'three';
import { Vector3 } from 'three';

/**
 * @public
 * The default parameter for a text to be displayed.
 */
export declare const defaultTextParams: {
    /** The position where the text should be displayed. */
    position: Partial<Vector3> | number[];
    color: ColorRepresentation;
    colorOpacity: number;
    background: ColorRepresentation;
    backgroundOpacity: number;
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
    constructor({ maxCount, col, row, billboard, charPerUnit, }?: {
        maxCount?: number | undefined;
        col?: number | undefined;
        row?: number | undefined;
        billboard?: boolean | undefined;
        charPerUnit?: number | undefined;
    });
    setTextAt(index: number, text: string, option?: TextParams): this;
}

/**
 * @public
 */
export declare type TextParams = Partial<typeof defaultTextParams>;

export { }
