import sharp from 'sharp';
import {resolveProjectPath} from './lib/fsutil.js';
import {basename} from 'node:path';

const SWEEP_22K = resolveProjectPath('test-data/sweep-20-20000hz-48k-linear.png');
const SWEEP_22K2 = resolveProjectPath('test-data/sweep-20-22000hz-48k-linear.png');

const CHANNELS = 3;

for (const inFilePath of [SWEEP_22K, SWEEP_22K2]) {

    let image = sharp(inFilePath);

    const outFilePath = resolveProjectPath(`output/${basename(inFilePath).replace('linear', 'mel')}`)

    const {width, height} = await image.metadata();

    const {data: rgba, info} = await image
        .removeAlpha()
        .raw()
        .toBuffer({resolveWithObject: true});

    await sharp(rgba, {raw: {width, height, channels: CHANNELS}})
        .toFile(outFilePath)
}
