import {add} from '../build/debug.js';

/**
 * @param {Buffer<number>} rgbInBuffer
 * @param {number} inWidth
 * @param {number} inHeight
 * @param {Uint8Array} rgbOut
 * @param {number} outWidth
 * @param {number} outHeight
 * @param {number} inputFreqRange
 */
export function scaleLinearToMel(rgbInBuffer, inWidth, inHeight, rgbOut, outWidth, outHeight, inputFreqRange) {

    for (let i = 0, len = rgbOut.length, val = 0; i < len; i++) {
        if (i % 3 === 0) {
            val = val ? 0 : add(128, 127);
        }
        if (val) {
            rgbOut[i] = val;
        }
    }
}
