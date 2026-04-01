import net from 'net';
import fs from 'fs/promises'; 
import path from 'path';
import { Buffer } from 'buffer';
import parseHttpRequest from './parser';

const ROOT_DIR = process.cwd();

type StaticRoute = {
  match: string
  root: string
}

type Site = {
  host: string
  routes: StaticRoute[]
}

type Config = {
  port: number
  sites: Site[]
}

async function loadConfig(): Promise<Config> {
  const configPath = path.join(ROOT_DIR, 'config.json');

  try {
    const configData = await fs.readFile(configPath, 'utf-8');
    const config: Config = JSON.parse(configData);

    // Better validation
    if (typeof config.port !== 'number' || config.port < 1) {
      throw new Error('Invalid port number in config');
    }
    if (!Array.isArray(config.sites) || config.sites.length === 0) {
      throw new Error('At least one site must be defined in config');
    }

    for (const site of config.sites) {
      if (typeof site.host !== 'string') throw new Error('Site host must be string');
      if (!Array.isArray(site.routes)) throw new Error('Site routes must be an array');
    }

    console.log(`Config loaded successfully from: ${configPath}`);
    return config;

  } catch (err: any) {
    console.error(' Failed to load config.json');
    console.error(`Make sure you have a file named 'config.json' in this folder:`);
    console.error(`→ ${ROOT_DIR}`);
    throw err;
  }
}

/* async function main() {
    const config = await loadConfig();
    console.log(JSON.stringify(config, null, 2));
    const { port, sites: [host, routes] } = config;
    console.log(port);
    console.log(host);
}
main(); */

const server = net.createServer( async (socket: net.Socket) => {
    console.log('Client connected');


    socket.on('data', (data: Buffer) => {

      const req = parseHttpRequest(data);
      console.log(req);

      /*   console.log(data);
        const headerEndIndex = data.indexOf('\r\n\r\n');
        console.log(`index: ${headerEndIndex}`);
        const header = data.subarray(0, headerEndIndex).toString();
        console.log(`Headers from buffer: ${header}`);
        console.log(`Remaining buffer`);
        console.log(data);

        const requestData: string = data.toString();
        const requestLine: string  = requestData.split('\r\n')[0];
        const requestBody: string  = requestData.split('\r\n')[1];
        const [method, path, protocol] = requestLine.split(' ');
        console.log(`Request Line: ${requestLine}`);
        console.log(`path: ${path}`);
        console.log(`Received data: ${requestData}`);
        const [key, ...value] = requestBody.split(": ");
        console.log(`Keys: ${key}`)
        console.log(`values: ${value}`)
       // socket.write(`Echo: ${data.toString()}`);
       const html = `
        <h1>Hello from Raw TCP Server</h1>
        <p>You sent a request to port 8080</p>
        <pre>${requestData.replace(/</g, '&lt;')}</pre>
        `;

        const response = `HTTP/1.1 404 Not Found\r\n` +
                        `Content-Type: text/html\r\n` +
                        `Content-Length: ${Buffer.byteLength(html)}\r\n` +
                        `Connection: close\r\n\r\n` +
                        html;

        socket.write(response);
        socket.end(); */
    });
    socket.on('end', () => {
        console.log('Client disconnected');
    });
});

server.on('error', (err: Error) => {
    console.error(`Server error: ${err}`);
});


server.listen(8080, () => {
    console.log('Server listening on port 8080');
});