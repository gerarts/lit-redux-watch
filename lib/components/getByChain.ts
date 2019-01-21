export function getByChain<T = any, R = any>(object: T, path: string[]): R | null | undefined {
    if (!path || !Array.isArray(path) || path.length === 0) {
        return <R><unknown>object;
    }

    if (object === undefined || object === null) {
        return undefined;
    }

    const [next, ...rest] = path;

    try {
        return getByChain<any, R>((<{[key: string]: any}>object)[next], rest);
    } catch (_) {
        return undefined;
    }
}
