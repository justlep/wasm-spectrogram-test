import sharp from 'sharp';
import {resolveProjectPath} from './lib/fsutil.js';
import {scaleLinearToMel} from './lib/rescale.js';

const SWEEP_20K = resolveProjectPath('test-data/sweep-20-20000hz-48k-linear.png');
const SWEEP_22K = resolveProjectPath('test-data/sweep-20-22000hz-48k-linear.png');
const SWEEP_24K = resolveProjectPath('test-data/sweep-20-24000hz-48k-linear.png');

const OUT_WIDTH = 800;
const OUT_HEIGHT = 256;

const CHANNELS = 3;

for (const inFilePath of [SWEEP_20K, SWEEP_22K, SWEEP_24K]) {

    let image = sharp(inFilePath);

    const outFilePath = inFilePath.replace(/-linear\.png$/, '-mel.png');

    const {width, height} = await image.metadata();

    const {data: rgb, info} = await image
        .removeAlpha()
        .raw()
        .toBuffer({resolveWithObject: true});

    const scaledRgb = new Uint8Array(OUT_WIDTH * OUT_HEIGHT * CHANNELS);

    scaleLinearToMel(rgb, width, height, scaledRgb, OUT_WIDTH, OUT_HEIGHT);

    await sharp(scaledRgb, {raw: {
            width: OUT_WIDTH,
            height: OUT_HEIGHT,
            channels: CHANNELS
        }})
        .toFile(outFilePath)
}
