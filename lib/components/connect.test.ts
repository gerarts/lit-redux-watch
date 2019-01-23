// tslint:disable max-classes-per-file
import { connect, defaultWatchOptions, watch } from '../';
import { store } from './helpers.test';
import { ConnectAddons } from './types';

interface ConnectAddonsWithUpdate extends ConnectAddons {
    requestUpdate(name?: PropertyKey, oldValue?: any): void;
}

test('Connect returns a class', () => {
    const clazz: new (...args: any[]) => any = class A {};
    const result: any = connect()(clazz);
    expect(typeof result).toBe('function');
    expect(Function.prototype.toString.call(result)).toMatch(/^class\s/);
});

test('Connect class litReduxWatchConnectProperty adds property to litReduxWatchConnectWatchedProperties', () => {
    const result: ConnectAddons = <ConnectAddons>connect()(class A {});
    result.litReduxWatchConnectProperty('myFancyProperty', defaultWatchOptions(), [], store);
    expect([...result.litReduxWatchConnectWatchedProperties.keys()]).toContain('myFancyProperty');
});

test('Extended connect class litReduxWatchConnectProperty adds property to litReduxWatchConnectWatchedProperties', () => {
    const result: ConnectAddons = <ConnectAddons>class extends connect()(class A {}) {};
    result.litReduxWatchConnectProperty('myFancyPropertyOnExtended', defaultWatchOptions(), [], store);
    expect([...result.litReduxWatchConnectWatchedProperties.keys()]).toContain('myFancyPropertyOnExtended');
});

test('Connect created property calls requestUpdate (LitElement integration)', (done: jest.DoneCallback) => {
    /**
     * Test class
     */
    class Test extends (<ConnectAddonsWithUpdate>connect(store)(class A {
        // tslint:disable-next-line function-name
        public requestUpdate(): void {
            done(); // Call jest callback
        }
    })) {
        @watch('defaultReducer.nested.values')
        public readonly property?: string;
    }

    // Doing something with value
    return new Test();
});
