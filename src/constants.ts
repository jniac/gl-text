/**
 * The number of int8 that a float32 can "hold" (ieee754).
 * It is 3 and not 4, because the biggest integer a float 32 can define is 2^24
 * https://stackoverflow.com/a/3793950/4696005
 */
export const INT8_PER_FLOAT32 = 3
export const INT6_PER_FLOAT32 = 4

/**
 * int8 are used to encode chars, so there can be 2^8 different chars.
 */
export const MAX_CHARS_IN_ATLAS = 256 // 2^8

/**
 * Actually a matrix4 is used to hold the data of each small text.
 * So the maximum number of chars a instance can display is the maximum of int8
 * a float32 can hold multiply by the number of float a matrix4 contains.
 */
export const MAX_TOTAL_CHARS = 16 * INT8_PER_FLOAT32 // 48

/**
 * Line length is encoded into `int6`, because a float32 can hold 4 `int6` (max
 * integer in float32 is 2^24, 4x6=24), so the max number of characters per line
 * is 2^6=64. And 64 is a good choice for a line:
 * https://baymard.com/blog/line-length-readability
 */
export const MAX_CHARS_PER_LINE = 64 // 2^6

/**
 * Actually a vec2 is used to hold the data of line's lengths. As there are 4 int6
 * in a float32, the maximum number of lines is 8.
 */
export const MAX_LINES = 2 * INT6_PER_FLOAT32 // 8

