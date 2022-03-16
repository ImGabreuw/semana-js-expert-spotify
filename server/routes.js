import config from './config.js';
import { Controller } from './controller.js';
import { logger } from './utils.js';

const {
  location,
  pages: {
    homeHTML
  }
} = config;

const controller = new Controller();

async function routes(request, response) {
  const { method, url } = request;

  if (method === 'GET' && url === '/') {
    response.writeHead(302, {
      'Location': location.home
    });

    return response.end();
  }

  if (method === 'GET' && url === '/home') {
    const { stream, type } = await controller.getFileStream(homeHTML);

    response.writeHead(200, {
      'Content-Type': 'text/html'
    });

    return stream.pipe(response);
  }

  return response.end('hello')
}

export function handler(request, response) {
  return routes(request, response)
    .catch(error => logger.error(`Erro: ${error.stack}`))
}
