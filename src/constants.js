import {resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const PROJECT_ROOT_PATH = resolve(fileURLToPath(import.meta.url), '../..');

/**
 * @param {string} [relPath]
 * @return {string}
 */
export const resolveProjectPath = (relPath) => relPath ? join(PROJECT_ROOT_PATH, relPath) : PROJECT_ROOT_PATH;

export const MEL_SPECTROGRAM_WIDTH = 800;
export const MEL_SPECTROGRAM_HEIGHT = 256;

export const COLOR_CHANNELS = 3;
