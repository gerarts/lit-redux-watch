import { Store } from 'redux';
import { getByChain } from './getByChain';
import { ConnectAddons, ConnectMixinFunction, Constructable, FinalWatchOptions, WatchedProperty, WatchOptions } from './types';

/**
 * Connect mixin to add watch functionality to a class. When used with LitElement
 * requestUpdate is called to apply updates when watched values change.
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
            protected static litReduxWatchConnectWatchedProperties: Map<PropertyKey, WatchedProperty>;

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

            /**
             * Connect a property to object and add to the list of watchers to be connected on construct.
             */
            public static litReduxWatchConnectProperty(// tslint:disable-line function-name
                name: PropertyKey,
                finalWatchOptions: FinalWatchOptions<any>,
                finalWatchPath: string[],
                finalWatchStore: Store,
            ): void {
                if (!this.litReduxWatchConnectWatchedProperties) {
                    this.litReduxWatchConnectWatchedProperties = new Map();
                }
                this.litReduxWatchConnectWatchedProperties.set(name, {
                    options: finalWatchOptions,
                    path: finalWatchPath,
                    store: finalWatchStore,
                });

                // tslint:disable-next-line no-unsafe-any
                if (this.prototype.hasOwnProperty(name)) {
                    return;
                }
                const key: string = `__litReduxWatchProperty_${String(name)}`;
                Object.defineProperty(this.prototype, name, {
                    get(): T | undefined {
                        // tslint:disable-next-line no-unsafe-any
                        return this[key];
                    },
                    set(value: T): void {
                        // tslint:disable no-unsafe-any
                        const oldValue: any = this[name];
                        this[key] = value;
                        if (typeof this.requestUpdate === 'function') {
                            this.requestUpdate(name, oldValue);
                        }
                        // tslint:enable no-unsafe-any
                    },
                    configurable : true,
                    enumerable : true,
                });
            }
        };
    };
}
