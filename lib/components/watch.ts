import { Store } from 'redux';
import { ConnectAddons, FinalWatchOptions, WatchDecoratorFunction, WatchOptions } from './types';

/**
 * Decorator to attach a property to a redux store.
 */
export function watch<T = any>(path: string, options?: WatchOptions<T>, store?: Store): WatchDecoratorFunction;
export function watch<T = any>(path: string, store: Store): WatchDecoratorFunction;
export function watch<T = any>(path: string, options: WatchOptions<T> | Store = {}, store?: Store): WatchDecoratorFunction {
    return (proto: any, name: PropertyKey): void => {
        const watchPath: string[] = path ? path.split('.') : [];
        let watchOptions: WatchOptions<T> = {};
        let finalWatchOptions: FinalWatchOptions<T> = {
            compare: (a?: T | null, b?: T | null): boolean => a === b,
            shouldUpdate: (): boolean => true,
            transform: (nextValue?: T | null): T | null | undefined => nextValue,
        };
        let watchStore: Store | null = null;

        if (options && typeof (<Store>options).getState === 'function') {
            watchStore = <Store>options;
        } else if (options && typeof options === 'object') {
            watchOptions = <WatchOptions<T>>options;
        }

        if (store && typeof store.getState === 'function') {
            watchStore = store;
        }

        // tslint:disable no-unsafe-any
        // Take mixin options and override with locally provided when set and definitively set the store
        if ((<ConnectAddons>proto.constructor).litReduxWatchConnectDefaultOptions) {
            watchOptions = {
                ...<WatchOptions<T>>(<ConnectAddons>proto.constructor).litReduxWatchConnectDefaultOptions || {},
                ...watchOptions,
            };
            watchStore = watchStore ? watchStore : (<ConnectAddons>proto.constructor).litReduxWatchConnectDefaultStore;
        }
        // tslint:enable no-unsafe-any

        // Finalize watch options
        finalWatchOptions = {
            ...finalWatchOptions,
            ...watchOptions,
        };

        // Check if a store is attached
        if (!watchStore) {
            throw Error(`Missing store! Could not attach ${path} to ${String(name)}. Read the documentation for more information.`);
        }

        // tslint:disable-next-line no-unsafe-any
        (<ConnectAddons>proto.constructor).litReduxWatchConnectProperty(name, finalWatchOptions, watchPath, watchStore);
    };
}
