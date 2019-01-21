import { Store } from 'redux';
import { getByChain } from './getByChain';
import { ConnectAddons, ConnectMixinFunction, Constructable, WatchedProperty, WatchOptions } from './types';

/**
 *
 */
export function connect<C = any>(store?: Store, options: WatchOptions<C> = {}): ConnectMixinFunction {
    return <T extends Constructable<any>>(superClass: T): T => {
        return class extends superClass {

            static get litReduxWatchConnectDefaultStore(): Store | null {
                return store || null;
            }
            static get litReduxWatchConnectDefaultOptions(): WatchOptions<C> {
                return options;
            }

            /**
             * List of all watched properties
             */
            protected static litReduxWatchConnectWatchedProperties: Map<PropertyKey, WatchedProperty> = new Map();

            constructor(...args: any[]) {
                super(...args);

                // Attach all watchers
                (<ConnectAddons>this.constructor).litReduxWatchConnectWatchedProperties.forEach(
                    (property: WatchedProperty, name: PropertyKey) => {
                        const { options: watchOptions, path, store: watchStore } = property;
                        const { compare, noInit, shouldUpdate, transform } = watchOptions;

                        // This will always hold the current value (pre-transform)
                        let currentValue: any = getByChain(watchStore.getState(), path);

                        // Set the value on init if noInit was not set to true
                        if (!noInit) {
                            this[String(name)] = transform(currentValue, undefined, path.join('.'));
                        }

                        watchStore.subscribe(() => {
                            const nextValue: any = getByChain(watchStore.getState(), path);
                            if (!compare(currentValue, nextValue)) {
                                if (shouldUpdate(nextValue, currentValue, path.join('.'))) {
                                    const oldValue: any = currentValue;
                                    currentValue = nextValue;
                                    this[String(name)] = transform(currentValue, oldValue, path.join('.'));
                                }
                            }
                        });
                    },
                );
            }
        };
    };
}
