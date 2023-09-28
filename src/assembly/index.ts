/**
 * Basically an AssemblyScript/TypeScript port of
 * https://github.com/justlep/sample-commander/blob/master/src/renderer/processing/spectrogramScaler.js
 */

const BYTES_PER_PIXEL = 3;
const MAX_CACHE_ENTRIES = 100;

const cachedLineIndexes = new Map<string, i32[]>();
const cachedWeights = new Map<string, f64[]>();

export function scaleLinearRgbToMel(sourceRgb: Uint8Array, sourceWidth: i32, sourceFreqRange: i32,
                                    targetHeight: i32 = 256, targetFreqLimit: i32 = 20000): Uint8Array {

    const bytesPerLine: i32 = sourceWidth * BYTES_PER_PIXEL;
    const inHeight: i32 = sourceRgb.length / sourceWidth / BYTES_PER_PIXEL;
    const rgbOut = new Uint8Array(sourceWidth * targetHeight * BYTES_PER_PIXEL);

    const cacheKey = `${inHeight}_${sourceFreqRange}_${targetHeight}_${targetFreqLimit}`;

    let lineIndexes: i32[];
    let weights: f64[];

    if (cachedLineIndexes.has(cacheKey)) {
        lineIndexes = cachedLineIndexes.get(cacheKey);
        weights = cachedWeights.get(cacheKey);
    } else {
        lineIndexes = [];
        weights = [];

        const outFreqRange: i32 = sourceFreqRange < targetFreqLimit ? sourceFreqRange : targetFreqLimit;
        const yMelAtMaxFrequency: f64 = 2595.0 * Math.log10(1.0 + <f64>outFreqRange / 700.0);
        const sourceHeightAtMaxFrequency: f64 = (outFreqRange < sourceFreqRange) ?
            (<f64>outFreqRange / <f64>sourceFreqRange * <f64>inHeight) : <f64>inHeight;

        for (let y: i32 = 1; y <= targetHeight; y++) {
            let perc: f64 = <f64>y / <f64>targetHeight,
                fMel: f64 = 700.0 * (Math.pow(10, perc * yMelAtMaxFrequency / 2595.0) - 1.0) / <f64>outFreqRange,
                // fSquared = perc * perc,                                                 // x^2 -> sqrt(x) scale
                // fSquaredCorrected = Math.pow(perc + FSQUARD_OFFSET, 2) / FSQUARED_OFFSET_SQUARE,
                // fLinear = perc,                                                         // 1:1
                f = fMel,
                lineOneBased: f64 = Math.max(1, Math.min(f * sourceHeightAtMaxFrequency, sourceHeightAtMaxFrequency)),
                lineZeroBased = lineOneBased - 1.0,
                mod = lineOneBased % 1;

            lineIndexes.push(<i32>Math.floor(lineZeroBased) * bytesPerLine);
            lineIndexes.push(<i32>Math.ceil(lineZeroBased) * bytesPerLine);

            weights.push(1 - mod);
            weights.push(lineOneBased <= inHeight ? mod : 0);
        }

        if (cachedLineIndexes.size > MAX_CACHE_ENTRIES) {
            // should rarely happen
            cachedLineIndexes.clear();
            cachedWeights.clear();
        }
        cachedLineIndexes.set(cacheKey, lineIndexes);
        cachedWeights.set(cacheKey, weights);
    }

    // non-linear scaling here
    for (let y: i32 = 0, cacheIndex: i32 = 0; y < targetHeight; y++) {
        let targetByteIndex: i32 = (<i32>targetHeight - y - 1) * bytesPerLine,
            lastTargetByteIndex = targetByteIndex + bytesPerLine,
            line1ByteIndex: i32 = lineIndexes[cacheIndex],
            line2ByteIndex: i32 = lineIndexes[cacheIndex + 1],
            weight1: f64 = weights[cacheIndex],
            weight2: f64 = weights[cacheIndex + 1];

        // console.log(`lineIndex 1/2: ${line1ByteIndex}/${line2ByteIndex}`);
        // console.log(`weight 1/2: ${weight1}/${weight2}`);

        cacheIndex += 2;

        while (targetByteIndex < lastTargetByteIndex) {
            let p1: u8 = sourceRgb[line1ByteIndex],
                p2: u8 = sourceRgb[line2ByteIndex],
                weightedP1: f64 = weight1 * <f64>p1,
                weightedP2: f64 = weight2 * <f64>p2,
                targetPixel: u8 = <u8>Math.floor(weightedP1 + weightedP2 + 0.5);

            // TODO add saturation/contract

            rgbOut[targetByteIndex] = targetPixel <= 255 ? targetPixel : 255;

            line1ByteIndex++;
            line2ByteIndex++;
            targetByteIndex++;
        }
    }

    return rgbOut;
}
