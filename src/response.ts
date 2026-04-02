function generateResponseStatus(statusCode: number) {
    const statusMessages: Record<number, string> = {
        200: 'OK',
        400: 'Bad Request',
        404: 'Not Found',
        500: 'Internal Server Error'
    };
    return statusMessages[statusCode] || 'Unknown Status';
};

export function createHttpResponse(
    statusCode: number, 
    body: string, 
): string {

    let bodyStr = '';
    let contentType = 'text/plain';

    if (body !== undefined && body !== null) {
        if (typeof body === 'object') {
            bodyStr = JSON.stringify(body);
            contentType = 'application/json';            
        }else {
            bodyStr = String(body);
            contentType = 'text/plain';
        }
    }
    const contentLength = Buffer.byteLength(bodyStr, 'utf-8');

    const statusMessage = generateResponseStatus(statusCode);
    const response = 
        `HTTP/1.1 ${statusCode} ${statusMessage}\r\n` +
        `Content-Type: ${contentType}\r\n` +   
        `Content-Length: ${contentLength}\r\n` +
        `\r\n` +                               
        bodyStr;  

    return response;

}