type ParsedUrl = {
    pathname: string;
    query: Record<string, string>;
};

export function parseUrl(url: string): ParsedUrl {
    const urlObj = new URL(url, 'http://localhost:3000');
    return {
        pathname: urlObj.pathname,
        query: Object.fromEntries(urlObj.searchParams)
    }
}