import { Store } from 'redux';

export interface ConnectAddons extends Function {
    litReduxWatchConnectWatchedProperties: Map<PropertyKey, WatchedProperty>;
    litReduxWatchConnectDefaultStore: Store | null;
    litReduxWatchConnectDefaultOptions: WatchOptions<any>;
}

export type WatchOptionsCompareFunction<T> = (a?: T | null, b?: T | null) => boolean;
export type WatchOptionsShouldUpdateFunction<T> = (nextValue?: T | null, currentValue?: T | null, path?: string) => boolean;
export type WatchOptionsTransformFunction<T> = (nextValue?: T | null, oldValue?: T | null, path?: string) => T | null | undefined;

export interface WatchOptions<T> {
    /**
     * Override the default compare function with a custom function.
     */
    compare?: WatchOptionsCompareFunction<T>;
    /**
     * Indicates whether the value should be loaded from redux on init. By
     * default the value will be loaded when the property is initialized
     * but this can be disabled by setting `noInit: true`.
     */
    noInit?: boolean;
    /**
     * A function that is called when a new value is found that should return
     * a boolean to indicate whether the value should be updated.
     */
    shouldUpdate?: WatchOptionsShouldUpdateFunction<T>;
    /**
     * A function that is called when the value is updated that allowes the
     * new value to be transformed. Note: this does not transform the value
     * that is passed as the second argument of the shouldUpdate and
     * transform functions.
     */
    transform?: WatchOptionsTransformFunction<T>;
}

export interface FinalWatchOptions<T> extends WatchOptions<T> {
    compare: WatchOptionsCompareFunction<T>;
    noInit?: boolean;
    shouldUpdate: WatchOptionsShouldUpdateFunction<T>;
    transform: WatchOptionsTransformFunction<T>;
}

export interface WatchedProperty {
    options: FinalWatchOptions<any>;
    path: string[];
    store: Store;
}

export type Constructable<T> = new (...args: any[]) => T;
export type ConnectMixinFunction = <T extends Constructable<any>>(superClass: T) => T;
export type WatchDecoratorFunction = (proto: any, name: PropertyKey) => void;
