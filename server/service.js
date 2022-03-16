import fs from 'fs';
import fsPromises from 'fs/promises';
import config from './config.js';
import { join } from 'path';

const {
  dir: {
    publicDirectory
  }
} = config;

export class Service {
  createFileStream(filename) {
    return fs.createReadStream(filename);
  }

  async getFileInfo(file) {
    const absolutePath = join(publicDirectory, file);
    await fsPromises.access(absolutePath);

    const fileType = extname(fullFilePath);

    return {
      type: fileType,
      name: absolutePath,
    }
  }

  async getFileStream(file) {
    const { type, name } = await this.getFileInfo(file)
    return {
      stream: this.createFileStream(name),
      type
    }
  }
}
