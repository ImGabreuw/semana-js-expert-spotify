import fs from 'fs';
import path from 'path';
import fsPromises from 'fs/promises';
import { randomUUID } from 'crypto';
import { PassThrough, Writable } from 'stream';
import streamsPromises from 'stream/promises';
import { once } from 'events';
import config from './config.js';
import { join, extname } from 'path';
import Throttle from 'throttle';
import childProcess from 'child_process';
import { logger } from './utils.js';

const {
  dir: {
    publicDirectory,
    fxDirectory
  },
  constants: {
    fallbackBitRate,
    englishConversation,
    bitRateDivisor,
    audioMediaType,
    songVolume,
    fxVolume
  }
} = config;

export class Service {
  constructor() {
    this.clientStreams = new Map();
    this.currentSong = englishConversation;
    this.currentBitRate = 0;
    this.throttleTransform = {};
    this.currentReadable = {};
  }

  createClientStream() {
    const id = randomUUID();
    const clientStream = new PassThrough();

    this.clientStreams.set(id, clientStream);

    return {
      id,
      clientStream
    }
  }

  removeClientStream(id) {
    this.clientStreams.delete(id);
  }

  _executeSoxCommand(args) {
    return childProcess.spawn('sox', args);
  }

  async getBitRate(song) {
    try {
      const args = [
        '--i', // info
        '-B', // bitrate
        song
      ]
      const {
        stderr, // erros
        stdout, // logs
        // stdin // enviar dados como stream
      } = this._executeSoxCommand(args);

      await Promise.all([
        once(stderr, 'readable'),
        once(stdout, 'readable'),
      ]);

      const [success, error] = [stdout, stderr].map(stream => stream.read());

      if (error) {
        return await Promise.reject(error);
      }

      return success
        .toString()
        .trim()
        .replace(/k/, '000');
    } catch (error) {
      logger.error(`deu ruim no bitrate: ${error}`);

      return fallbackBitRate;
    }
  }

  broadCast() {
    return new Writable({
      write: (chunk, enc, cb) => {
        for (const [id, stream] of this.clientStreams) {
          if (stream.writableEnded) {
            this.clientStreams.delete(id);
            continue;
          }

          stream.write(chunk);
        }

        cb();
      }
    });
  }

  async startStreamming() {
    logger.info(`starting with ${this.currentSong}`);

    const bitRate = this.currentBitRate = (await this.getBitRate(this.currentSong)) / bitRateDivisor;
    const throttleTransform = this.throttleTransform = new Throttle(bitRate);
    const songReadable = this.currentReadable = this.createFileStream(this.currentSong);

    return streamsPromises.pipeline(
      songReadable,
      throttleTransform,
      this.broadCast()
    );
  }

  stopStreamming() {
    this.throttleTransform?.end?.();
  }

  createFileStream(filename) {
    return fs.createReadStream(filename);
  }

  async getFileInfo(file) {
    const absolutePath = join(publicDirectory, file);
    await fsPromises.access(absolutePath);

    const fileType = extname(absolutePath);

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

  async readFxByName(fxName) {
    const songs = await fsPromises.readdir(fxDirectory)
    const chosenSong = songs.find(filename => filename.toLowerCase().includes(fxName))
    if (!chosenSong) return Promise.reject(`the song ${fxName} wasn't found!`)

    return path.join(fxDirectory, chosenSong);
  }

  appendFxStream(fx) {
    const throttleTransformable = new Throttle(this.currentBitRate)
    streamsPromises.pipeline(
      throttleTransformable,
      this.broadCast()
    )

    const unpipe = () => {
      const transformStream = this.mergeAudioStreams(fx, this.currentReadable)

      this.throttleTransform = throttleTransformable
      this.currentReadable = transformStream
      this.currentReadable.removeListener('unpipe', unpipe)

      streamsPromises.pipeline(
        transformStream,
        throttleTransformable
      )

    }
    this.throttleTransform.on('unpipe', unpipe)
    this.throttleTransform.pause()
    this.currentReadable.unpipe(this.throttleTransform)
  }


  mergeAudioStreams(song, readable) {
    const transformStream = PassThrough()
    const args = [
      '-t', audioMediaType,
      '-v', songVolume,
      // -m => merge -> o - é para receber como stream
      '-m', '-',
      '-t', audioMediaType,
      '-v', fxVolume,
      song,
      '-t', audioMediaType,
      '-'
    ]

    const { stdout, stdin } = this._executeSoxCommand(args);

    streamsPromises.pipeline(readable, stdin);
    streamsPromises.pipeline(stdout, transformStream);

    return transformStream;
  }
}
