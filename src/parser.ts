import { parseUrl } from "./params.js";

export type HttpRequest = {
    method: string;
    pathname: string;
    query: Record<string, string>;
    version: string;
    headers: Record<string, string>;
    body: string;
}

function parseHttpRequest(data:Buffer): HttpRequest {

    let buffer = Buffer.alloc(0);
    buffer = Buffer.concat([buffer, data]);

    while (true) {
        const headerEndIndex = buffer.indexOf('\r\n\r\n');
        if (headerEndIndex === -1) break; 

        const header = buffer.subarray(0, headerEndIndex).toString();
        
        const lines = header.split('\r\n');
        const request = lines[0];
        let [method, url, version] = request.split(' ')
        const headers: Record<string, string> = {};
        for (let i = 1; i < lines.length; i++){
            const [key, ...value] = lines[i].split(': ');
            headers[key.toLowerCase()] = value.join(": ");
        }

        const parsedUrl = parseUrl(url);

        const contentLength: number = parseInt(headers["content-length"] , 10);
        const bodystart = headerEndIndex + 4;
        if (buffer.length < bodystart + contentLength)  break;
        const body = buffer.subarray(bodystart, bodystart + contentLength).toString();

        return {
            method: method || '',
            pathname: parsedUrl.pathname || '',
            query: parsedUrl.query,
            version: version || '',
            headers,
            body
        };
    }
    return {
        method: '',
        pathname: '',
        query: {},
        version: '',
        headers: {},
        body: ''
    };
}

export default parseHttpRequest;