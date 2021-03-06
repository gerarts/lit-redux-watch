import { Action, AnyAction, Store } from 'redux';

export type Constructable<T> = new (...args: any[]) => T;
export type WatchSource<S, T = any> = string | ((state: S) => T | undefined);

export interface ConnectAddons<S = any, A extends Action = AnyAction> extends Constructable<any> {
    litReduxWatchConnectWatchedProperties: Map<PropertyKey, WatchedProperty<S, A>>;
    litReduxWatchConnectDefaultStore?: Store<S, A>;
    litReduxWatchConnectDefaultOptions: WatchOptions<any>;
    litReduxWatchConnectProperty(
        name: PropertyKey,
        finalWatchOptions: FinalWatchOptions,
        finalWatchSource: WatchSource<S>,
        finalWatchStore: Store<S, A>,
    ): void;
}

export type WatchOptionsCompareFunction<T> = (a?: T, b?: T) => boolean;
export type WatchOptionsShouldUpdateFunction<T> = (nextValue?: T, currentValue?: T, source?: WatchSource<T>) => boolean;
export type WatchOptionsTransformFunction<T> = (nextValue?: T, oldValue?: T, source?: WatchSource<T>) => T | undefined;

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
     * A function that is called when the value is updated that allows the
     * new value to be transformed. Note: this does not transform the value
     * that is passed as the second argument of the shouldUpdate and
     * transform functions.
     */
    transform?: WatchOptionsTransformFunction<T>;
}

export interface WatchDeclaration<S = any, A extends Action = AnyAction> extends WatchOptions<any> {
    /**
     * The source to be watched. This can be an object path as a dot-separated
     * string or a function that takes the current state and returns the value
     * that should be used as the nextValue.
     */
    source: WatchSource<S>;
    /**
     * The store to be watched for updates.
     */
    store?: Store<S, A>;
}
export interface WatchDeclarations<S = any, A extends Action = AnyAction> {
    [key: string]: WatchDeclaration<S, A>;
}

export interface FinalWatchOptions<T = any> extends WatchOptions<T> {
    compare: WatchOptionsCompareFunction<T>;
    noInit?: boolean;
    shouldUpdate: WatchOptionsShouldUpdateFunction<T>;
    transform: WatchOptionsTransformFunction<T>;
}

export interface WatchedProperty<S = any, A extends Action = AnyAction> {
    options: FinalWatchOptions;
    source: WatchSource<S>;
    store: Store<S, A>;
}

export type ConnectMixinFunction = <T extends Constructable<any>>(superClass: T) => T;
export type WatchDecoratorFunction = (proto: any, name: PropertyKey) => void;
