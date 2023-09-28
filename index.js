import sharp from 'sharp';
import {resolveProjectPath} from './lib/fsutil.js';

const SWEEP_20K = resolveProjectPath('test-data/sweep-20-20000hz-48k-linear.png');
const SWEEP_22K = resolveProjectPath('test-data/sweep-20-22000hz-48k-linear.png');
const SWEEP_24K = resolveProjectPath('test-data/sweep-20-24000hz-48k-linear.png');

const CHANNELS = 3;

for (const inFilePath of [SWEEP_20K, SWEEP_22K, SWEEP_24K]) {

    let image = sharp(inFilePath);

    const outFilePath = inFilePath.replace(/-linear\.png$/, '-mel.png');

    const {width, height} = await image.metadata();

    const {data: rgba, info} = await image
        .removeAlpha()
        .raw()
        .toBuffer({resolveWithObject: true});

    await sharp(rgba, {raw: {width, height, channels: CHANNELS}})
        .toFile(outFilePath)
}
