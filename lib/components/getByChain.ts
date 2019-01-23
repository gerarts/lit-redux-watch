/**
 * Gets a value from an object by a path separated with dots. When
 * no value can be found undefined is returned.
 */
export function getByChain<T = any, R = any>(object: T, path: string[]): R | null | undefined {
    if (!Array.isArray(path) || path.length === 0) {
        return <R><unknown>object;
    }

    if (object === undefined || object === null) {
        return undefined;
    }

    const [next, ...rest] = path;

    return getByChain<any, R>((<{[key: string]: any}>object)[next], rest);
}
