// tslint:disable max-func-body-length
import { Store } from 'redux';
import { getValueFromStore } from './getValueFromStore';
import {
    ConnectAddons,
    ConnectMixinFunction,
    Constructable,
    FinalWatchOptions,
    WatchDeclarations,
    WatchedProperty,
    WatchOptions,
    WatchSource,
} from './types';
import { defaultWatchOptions } from './watch';

/**
 * Connect mixin to add watch functionality to a class. When used with LitElement
 * requestUpdate is called to apply updates when watched values change.
 */
export function connect<C = any>(defaultStore?: Store, defaultOptions?: WatchOptions<C>): ConnectMixinFunction {
    return <T extends Constructable<any>>(superClass: T): T => {
        return class extends superClass {

            static get litReduxWatchConnectDefaultStore(): Store | undefined {
                return defaultStore;
            }
            static get litReduxWatchConnectDefaultOptions(): WatchOptions<C> | undefined {
                return defaultOptions;
            }

            public static watch: WatchDeclarations;

            /**
             * Marks class as having finished creating properties.
             */
            protected static finalized: boolean;

            /**
             * List of all watched properties
             */
            protected static litReduxWatchConnectWatchedProperties: Map<PropertyKey, WatchedProperty>;

            constructor(...args: any[]) {
                super(...args);

                // Attach all watchers
                ((<ConnectAddons>this.constructor).litReduxWatchConnectWatchedProperties || new Map()).forEach(
                    (property: WatchedProperty, name: PropertyKey) => {
                        const { options: watchOptions, source, store: watchStore } = property;
                        const { compare, noInit, shouldUpdate, transform } = watchOptions;

                        // This will always hold the current value (pre-transform)
                        let currentValue: any = getValueFromStore(watchStore, source);

                        // Set the value on init if noInit was not set to true
                        if (!noInit) {
                            this[String(name)] = transform(currentValue, undefined, source);
                        }

                        watchStore.subscribe(() => {
                            const nextValue: any = getValueFromStore(watchStore, source);
                            if (!compare(currentValue, nextValue)) {
                                if (shouldUpdate(nextValue, currentValue, source)) {
                                    const oldValue: any = currentValue;
                                    currentValue = nextValue;
                                    this[String(name)] = transform(currentValue, oldValue, source);
                                }
                            }
                        });
                    },
                );
            }

            // tslint:disable function-name no-unsafe-any
            /**
             * Connect a property to object and add to the list of watchers to be connected on construct.
             */
            public static litReduxWatchConnectProperty(
                name: PropertyKey,
                options: FinalWatchOptions,
                source: WatchSource,
                store: Store,
            ): void {
                this.litReduxWatchEnsureConnectWatchedProperties();
                this.litReduxWatchConnectWatchedProperties.set(name, { options, source, store });

                if (!this.prototype.hasOwnProperty(name)) {
                    const key: string = `__litReduxWatchProperty_${String(name)}`;

                    Object.defineProperty(this.prototype, name, {
                        get(): T | undefined {
                            return this[key];
                        },
                        set(value: T): void {
                            const oldValue: any = this[name];
                            this[key] = value;
                            if (typeof this.requestUpdate === 'function') {
                                this.requestUpdate(name, oldValue);
                            }
                        },
                        configurable : true,
                        enumerable : true,
                    });
                }
            }

            protected static finalize(): void {
                if (this.finalized) {
                    return;
                }

                // finalize any superclasses
                const superCtor: {finalize?: Function} = Object.getPrototypeOf(this);
                if (typeof superCtor.finalize === 'function') {
                    superCtor.finalize();
                }
                this.finalized = true;

                // Attach watchables
                this.litReduxWatchAttachWatchables();
            }

            private static litReduxWatchEnsureConnectWatchedProperties(): void {
                if (!this.litReduxWatchConnectWatchedProperties) {
                    this.litReduxWatchConnectWatchedProperties = new Map();
                }
            }

            private static litReduxWatchAttachWatchables(): void {
                if (this.hasOwnProperty('watch')) {
                    const watched: WatchDeclarations = this.watch;
                    [...Object.getOwnPropertyNames(watched)].forEach((key: string): void => {
                        const { source, store, ...options } = watched[key];
                        const finalStore: Store | undefined = store || this.litReduxWatchConnectDefaultStore;

                        if (!finalStore) {
                            throw Error(
                                `Missing store! Could not attach ${String(source)} to ${
                                    String(name)
                                }. Read the documentation for more information.`,
                            );
                        }

                        this.litReduxWatchConnectProperty(key, {
                            ...defaultWatchOptions(),
                            ...this.litReduxWatchConnectDefaultOptions,
                            ...options,
                        }, source, finalStore);
                    });
                }
            }
        };
    };
}
