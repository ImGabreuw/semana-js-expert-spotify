import { createServer } from "http";
import config from './config.js';
import { handler } from './routes.js'

export default () => createServer(handler)
