import sharp from 'sharp';
import {COLOR_CHANNELS, MEL_SPECTROGRAM_HEIGHT, MEL_SPECTROGRAM_WIDTH, resolveProjectPath} from '../src/constants.js';
import {scaleLinearToMel} from '../src/scaling.js';

const SWEEP_20K = 'sweep-20-20000hz-48k-linear.png';
const SWEEP_22K = 'sweep-20-22000hz-48k-linear.png';
const SWEEP_24K = 'sweep-20-24000hz-48k-linear.png';

for (const inFilename of [SWEEP_20K, SWEEP_22K, SWEEP_24K]) {

    const inFilePath = resolveProjectPath('tests/images/' + inFilename);
    const image = sharp(inFilePath);
    const outFilePath = inFilePath.replace(/-linear\.png$/, '-mel.png');
    const {width, height} = await image.metadata();
    const [outWidth, outHeight] = [MEL_SPECTROGRAM_WIDTH, MEL_SPECTROGRAM_HEIGHT];
    const inputFreqRange = parseInt(inFilename.match(/20-(\d{5})/)[1]);

    const {data: rgb, info} = await image
        .removeAlpha()
        .raw()
        .toBuffer({resolveWithObject: true});

    const scaledRgb = new Uint8Array(outWidth * outHeight * COLOR_CHANNELS);

    scaleLinearToMel(rgb, width, height, scaledRgb, MEL_SPECTROGRAM_WIDTH, MEL_SPECTROGRAM_HEIGHT, inputFreqRange);

    await sharp(scaledRgb, {raw: {
            width: outWidth,
            height: outHeight,
            channels: COLOR_CHANNELS
        }})
        .toFile(outFilePath)
        .then(() => console.log('Written ' + outFilePath))
}
