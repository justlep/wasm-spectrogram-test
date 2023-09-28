/**
 * @param {Buffer<number>} rgbInBuffer
 * @param {number} inWidth
 * @param {number} inHeight
 * @param {Uint8Array} rgbOut
 * @param {number} outWidth
 * @param {number} outHeight
 */
export function scaleLinearToMel(rgbInBuffer, inWidth, inHeight, rgbOut, outWidth, outHeight) {

    for (let i = 0, len = rgbOut.length, val = 0; i < len; i++) {
        if (i % 3 === 0) {
            val = val ? 0 : 128;
        }
        if (val) {
            rgbOut[i] = val;
        }
    }
}
