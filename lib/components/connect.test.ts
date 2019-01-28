// tslint:disable max-classes-per-file
import { connect, defaultWatchOptions, watch } from '../';
import { store } from './helpers.test';
import { ConnectAddons, Constructable, WatchDeclarations } from './types';

interface ConnectAddonsWithUpdate extends ConnectAddons {
    observedAttributes: string[];
    finalized: boolean;
    finalize(): void;
    requestUpdate(name?: PropertyKey, oldValue?: any): void;
}

/**
 * Class with simple finalizable
 */
const testClassFactory: () => Constructable<any> = (): Constructable<any> => class {
    public static finalized: boolean;

    constructor() {
        this.throwIfNotFinalized();
    }

    // tslint:disable-next-line function-name
    public static finalize(): void {
        this.finalized = true;
    }

    public throwIfNotFinalized(): void {
        if (!(<any>this.constructor).finalized) {
            throw Error('Class should be finalized');
        }
    }
};

test('Connect returns a class', () => {
    const clazz: new (...args: any[]) => any = class A {};
    const result: any = connect()(clazz);
    expect(typeof result).toBe('function');
    expect(Function.prototype.toString.call(result)).toMatch(/^class\s/);
});

test('Connect class litReduxWatchConnectProperty adds property to litReduxWatchConnectWatchedProperties', () => {
    const result: ConnectAddons = <ConnectAddons>connect()(class A {});
    result.litReduxWatchConnectProperty('myFancyProperty', defaultWatchOptions(), '', store);
    expect([...result.litReduxWatchConnectWatchedProperties.keys()]).toContain('myFancyProperty');
});

test('Extended connect class litReduxWatchConnectProperty adds property to litReduxWatchConnectWatchedProperties', () => {
    const result: ConnectAddons = <ConnectAddons>class extends connect()(class A {}) {};
    result.litReduxWatchConnectProperty('myFancyPropertyOnExtended', defaultWatchOptions(), '', store);
    expect([...result.litReduxWatchConnectWatchedProperties.keys()]).toContain('myFancyPropertyOnExtended');
});

test('Connect created property calls requestUpdate (LitElement integration)', (done: jest.DoneCallback) => {
    /**
     * Test class
     */
    class Test extends (<ConnectAddonsWithUpdate>connect(store)(class A extends testClassFactory() {
        // tslint:disable-next-line function-name
        public requestUpdate(): void {
            done(); // Call jest callback
        }
    })) {
        @watch('defaultReducer.nested.values')
        public readonly property?: string;
    }

    Test.finalize();

    // Doing something with value
    return new Test();
});

test('Connect created property via static get watch() should throw when store is missing', () => {
    expect(() => {
        /**
         * Test class
         */
        class Test extends (<ConnectAddonsWithUpdate>connect()(testClassFactory())) {
            public static get watch(): WatchDeclarations {
                return {
                    property: {
                        source: 'defaultReducer.nested.values',
                    },
                };
            }
            public readonly property?: string;
        }

        Test.finalize();

        // Doing something with value
        return new Test();
    }).toThrow();
});

test('Connect created property via static get watch() should not throw when store is in connect', () => {
    expect(() => {
        /**
         * Test class
         */
        class Test extends (<ConnectAddonsWithUpdate>connect(store)(testClassFactory())) {
            public static get watch(): WatchDeclarations {
                return {
                    property: {
                        source: 'defaultReducer.nested.values',
                    },
                };
            }
            public readonly property?: string;
        }

        Test.finalize();

        // Doing something with value
        return new Test();
    }).not.toThrow();
});

test('Connect created property via static get watch() should not throw when store is in watch declaration', () => {
    expect(() => {
        /**
         * Test class
         */
        class Test extends (<ConnectAddonsWithUpdate>connect()(testClassFactory())) {
            public static get watch(): WatchDeclarations {
                return {
                    property: {
                        source: 'defaultReducer.nested.values',
                        store,
                    },
                };
            }
            public readonly property?: string;
        }

        Test.finalize();

        // Doing something with value
        return new Test();
    }).not.toThrow();
});

test('Connect created property via static get watch() calls requestUpdate (LitElement integration)', (done: jest.DoneCallback) => {
    /**
     * Test class
     */
    class Test extends (<ConnectAddonsWithUpdate>connect(store)(class A extends testClassFactory() {
        // tslint:disable-next-line function-name
        public requestUpdate(): void {
            done(); // Call jest callback
        }
    })) {
        public static get watch(): WatchDeclarations {
            return {
                property: {
                    source: 'defaultReducer.nested.values',
                },
            };
        }
        public readonly property?: string;
    }

    Test.finalize();

    // Doing something with value
    return new Test();
});

test('Connect created property via static get watch() calls requestUpdate (LitElement integration)', (done: jest.DoneCallback) => {
    /**
     * Test class
     */
    class Test extends (<ConnectAddonsWithUpdate>connect(store)(class A extends testClassFactory() {
        // tslint:disable-next-line function-name
        public static finalize(): void {
            (<any>this.constructor).finalized = true;
            done(); // Call jest callback
        }
    })) {
        public static get watch(): WatchDeclarations {
            return {
                property: {
                    source: 'defaultReducer.nested.values',
                },
            };
        }
        public readonly property?: string;
    }

    Test.finalize();

    // Doing something with value
    return new Test();
});

test('Connect double finalize only called once', (done: jest.DoneCallback) => {
    let count: number = 0;
    const doneWrap: (() => void) = (): void => {
        count++;
        if (count > 1) {
            throw Error('Too many count');
        } else if (count === 1) {
            setTimeout(() => {
                done();
            }, 100);
        }
    };

    /**
     * Test class
     */
    class Test extends (<ConnectAddonsWithUpdate>connect(store)(class A extends testClassFactory() {
        // tslint:disable-next-line function-name
        public static finalize(): void {
            (<any>this.constructor).finalized = true;
            doneWrap(); // Call jest callback
        }
    })) {
        public static get watch(): WatchDeclarations {
            return {
                property: {
                    source: 'defaultReducer.nested.values',
                },
            };
        }
        public readonly property?: string;
    }

    Test.finalize();
    Test.finalize();

    // Doing something with value
    return new Test();
});
