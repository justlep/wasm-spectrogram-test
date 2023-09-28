import sharp from 'sharp';
import {COLOR_CHANNELS, resolveProjectPath} from '../src/constants.js';
import {scaleLinearRgbToMel} from '../build/debug.js';

export const SWEEP_20K = 'sweep-20-20000hz-48k-linear.png';
export const SWEEP_22K = 'sweep-20-22000hz-48k-linear.png';
export const SWEEP_24K = 'sweep-20-24000hz-48k-linear.png';

for (const inFilename of [SWEEP_20K, SWEEP_22K, SWEEP_24K]) {

    console.log('Process %s ...', inFilename);

    const inFilePath = resolveProjectPath('tests/images/' + inFilename);
    const outFilePath = resolveProjectPath('tests/images/' + inFilename.replace('-linear', '-mel'));

    const image = sharp(inFilePath);
    const {width: inWidth} = await image.metadata();
    const outWidth = inWidth;
    const outHeight = 256;
    const inFreqRange = parseInt(inFilename.match(/hz-(\d+)k-/)[1]) * 1000 / 2;

    const linearRgbBuffer = await image
        .removeAlpha()
        .flip()
        .raw()
        .toBuffer({resolveWithObject: true});

    const melRgb = scaleLinearRgbToMel(linearRgbBuffer.data, inWidth, inFreqRange);

    await sharp(melRgb, {raw: {
            width: outWidth,
            height: outHeight,
            channels: COLOR_CHANNELS
        }})
        .toFile(outFilePath)
        .then(() => console.log(' -> %s', outFilePath))
}
