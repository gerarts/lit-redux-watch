import { Store } from 'redux';
import { ConnectAddons, FinalWatchOptions, WatchDecoratorFunction, WatchOptions } from './types';

/**
 * Returns the property descriptor for a property on this prototype by walking
 * up the prototype chain. Note that we stop just before Object.prototype, which
 * also avoids issues with Symbol polyfills (core-js, get-own-property-symbols),
 * which create accessors for the symbols on Object.prototype.
 *
 * This came from an older version of updating-element.ts from LitElement where it eventually was removed in
 * https://github.com/Polymer/lit-element/commit/c6e05816de9e2e5ef6bcceecbc7b9ff1198478ea#diff-c5f280d12b2d91f8b89fe4ac3b6313d8L23
 */
type GetPropertyDescriptor = (name: PropertyKey, proto: any) => PropertyDescriptor | undefined;
const getPropertyDescriptor: GetPropertyDescriptor = (name: PropertyKey, proto: any): PropertyDescriptor | undefined => {
    let search: any = proto;

    // tslint:disable no-unsafe-any
    if (name in search) {
        while (search !== Object.prototype) {
            if (search.hasOwnProperty(name)) {
                return Object.getOwnPropertyDescriptor(search, name);
            }
            search = Object.getPrototypeOf(search);
        }
    }
    // tslint:enable no-unsafe-any

    return undefined;
};

/**
 *
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

        // Some of this came from an older version of updating-element.ts from LitElement -- see getPropertyDescriptor
        const superDesc: PropertyDescriptor | undefined = getPropertyDescriptor(name, proto);
        let desc: PropertyDescriptor;
        if (superDesc !== undefined && (superDesc.set && superDesc.get)) {
            const { set, get } = superDesc;
            desc = {
                get: function(): T | undefined {
                    // tslint:disable-next-line no-invalid-this no-unsafe-any
                    return <T>get.call(<any>this);
                },
                set: function(value: T): void {
                    // tslint:disable-next-line no-invalid-this no-unsafe-any
                    set.call(<any>this, value);
                },
                configurable: true,
                enumerable: true,
            };
        } else {
            const key: string = `__litReduxWatchProperty_${String(name)}`;
            desc = {
                get: function(): T | undefined {
                    // tslint:disable-next-line no-invalid-this no-unsafe-any
                    return (<any>this)[key];
                },
                set: function(value: T): void {
                    // tslint:disable-next-line no-invalid-this no-unsafe-any
                    (<any>this)[key] = value;
                },
                configurable : true,
                enumerable : true,
            };
        }

        // Attach property and add to watch list
        Object.defineProperty(proto, name, desc);

        // tslint:disable no-unsafe-any
        (<ConnectAddons>proto.constructor).litReduxWatchConnectWatchedProperties.set(name, {
            options: finalWatchOptions,
            path: watchPath,
            store: watchStore,
        });
        // tslint:enable no-unsafe-any
    };
}
