import { Action, Store } from 'redux';
import { ConnectAddons, FinalWatchOptions, WatchDecoratorFunction, WatchOptions, WatchSource } from './types';

/**
 * Default watch options with a simple strict equals compare.
 */
export const defaultWatchOptions: (<T = any>() => FinalWatchOptions<T>) = <T = any>(): FinalWatchOptions<T> => ({
    compare: (a?: T, b?: T): boolean => a === b,
    shouldUpdate: (): boolean => true,
    transform: (nextValue?: T): T | undefined => nextValue,
});

/**
 * Decorator to attach a property to a redux store.
 */
export function watch<S, A extends Action, T = any>(
    source: WatchSource<S>,
    options?: WatchOptions<T>,
    store?: Store<S, A>,
): WatchDecoratorFunction;
export function watch<S, A extends Action, T = any>(
    source: WatchSource<S>,
    store: Store<S, A>,
): WatchDecoratorFunction;
export function watch<S, A extends Action, T = any>(
    source: WatchSource<S>,
    options: WatchOptions<T> | Store<S, A> = {},
    store?: Store<S, A>,
): WatchDecoratorFunction {
    return (proto: any, name: PropertyKey): void => {
        let watchOptions: WatchOptions<T> | undefined;
        let watchStore: Store<S, A> | undefined;

        if (options && typeof (<Store<S, A>>options).getState === 'function') {
            watchStore = <Store<S, A>>options;
        } else if (options && typeof options === 'object') {
            watchOptions = <WatchOptions<T>>options;
        }

        if (store && typeof store.getState === 'function') {
            watchStore = store;
        }

        // tslint:disable no-unsafe-any
        if ((<ConnectAddons<S, A>>proto.constructor).litReduxWatchConnectDefaultStore && !watchStore) {
            watchStore = (<ConnectAddons<S, A>>proto.constructor).litReduxWatchConnectDefaultStore;
        }

        // Take mixin options and override with locally provided when set and definitively set the store and finalize watch options
        const finalWatchOptions: FinalWatchOptions<T> = {
            ...defaultWatchOptions<T>(),
            ...<WatchOptions<T>>(<ConnectAddons<S, A>>proto.constructor).litReduxWatchConnectDefaultOptions,
            ...watchOptions,
        };
        // tslint:enable no-unsafe-any

        // Check if a store is attached
        if (!watchStore) {
            throw Error(`Missing store! Could not attach ${source} to ${String(name)}. Read the documentation for more information.`);
        }

        // tslint:disable-next-line no-unsafe-any
        (<ConnectAddons<S, A>>proto.constructor).litReduxWatchConnectProperty(name, finalWatchOptions, source, watchStore);
    };
}
