// tslint:disable max-classes-per-file
import { createSelector, Selector } from 'reselect';
import { connect, watch } from '../';
import { DefaultState, store } from './helpers.test';

/**
 * Simple base class for testing
 */
class BaseClass {
    public propertyFromBase: number;
    constructor() {
        this.propertyFromBase = 4;
    }
}

test('Watcher connected store should not throw', () => {
    expect(() => {
        /**
         * Setting up classes with empty mixin and with watchers with store as parameter should not throw
         */
        class ExtendedClass extends connect()(BaseClass) {
            @watch('a.random.path', store)
            public watchedProp: string = 'watched';
        }

        // Doing something with the class.
        return new ExtendedClass();
    }).not.toThrow();
});

test('Watcher connected store with options should not throw', () => {
    expect(() => {
        /**
         * Setting up classes with empty mixin and with watchers with store as parameter should not throw
         */
        class ExtendedClass extends connect()(BaseClass) {
            @watch('a.random.path', {}, store)
            public watchedProp: string = 'watched';
        }

        // Doing something with the class.
        return new ExtendedClass();
    }).not.toThrow();
});

test('Mixin connected store should not throw', () => {
    expect(() => {
        /**
         * Setting up classes with watchers with mixin connected store should not throw
         */
        class MixinExtendedClass extends connect(store)(BaseClass) {
            @watch('a.random.path')
            public watchedProp: string = 'watched';
        }

        // Doing something with the class.
        return new MixinExtendedClass();
    }).not.toThrow();
});

test('Missing store throws', () => {
    expect(() => {
        /**
         * Setting up classes with watchers with missing store should throw
         */
        class MissingStoreThrows extends BaseClass {
            @watch('another.path')
            public prop: string = 'default';
        }

        // Doing something with the class. The return is never reached.
        return new MissingStoreThrows();
    }).toThrow();
});

test('Value from store should be loaded', () => {
    /**
     * Setting up classes with an existing reducer should init it with the value by default
     */
    class ValueFromReducer extends connect(store)(BaseClass) {
        @watch('defaultReducer')
        public prop?: object;
    }

    expect(new ValueFromReducer().prop).toEqual({ nested: { values: 'data' } });
});

test('Value from store should be able to be loaded with reselect', () => {
    const reselector: Selector<DefaultState, any> = createSelector(
        (state: DefaultState): DefaultState['defaultReducer'] => state.defaultReducer,
        (fromGetter: DefaultState['defaultReducer']): DefaultState['defaultReducer']['nested'] => fromGetter.nested,
    );
    /**
     * Setting up classes with an existing reducer should init it with the value by default
     */
    class ValueFromReducer extends connect(store)(BaseClass) {
        @watch(reselector)
        public prop?: object;
    }

    expect(new ValueFromReducer().prop).toEqual({ values: 'data' });
});

test('Nested value from store should be loaded', () => {
    /**
     * Setting up classes with an existing reducer should init it with the value by default
     */
    class ValueFromReducer extends connect(store)(BaseClass) {
        @watch('defaultReducer.nested')
        public prop?: object;
    }

    expect(new ValueFromReducer().prop).toEqual({ values: 'data' });
});

test('Deeply nested value from store should be loaded', () => {
    /**
     * Setting up classes with an existing reducer should init it with the value by default
     */
    class ValueFromReducer extends connect(store)(BaseClass) {
        @watch('defaultReducer.nested.values')
        public prop?: string;
    }

    expect(new ValueFromReducer().prop).toEqual('data');
});

test('Non-existing value from store should be undefined', () => {
    /**
     * Setting up classes with an existing reducer should init it with the value by default
     */
    class ValueFromReducer extends connect(store)(BaseClass) {
        @watch('defaultReducer.non.existing.values')
        public prop?: string;
    }

    expect(new ValueFromReducer().prop).toBeUndefined();
});

test('Should update after action', () => {
    const localKey: string = 'SHOULD_UPDATE_AFTER_ACTION';

    /**
     * Setting up classes with an existing reducer should init it with the value by default
     */
    class ValueFromReducer extends connect(store)(BaseClass) {
        @watch(`${localKey}.existing.value`)
        public prop?: string;
    }

    const valueFromReducer: ValueFromReducer = new ValueFromReducer();
    expect(valueFromReducer.prop).toBeUndefined();

    store.dispatch({ type: 'MERGE', data: { [localKey]: { existing: { value: 'placedText' } } } });
    expect(valueFromReducer.prop).toBe('placedText');
});

test('Should update after multiple actions', () => {
    const localKey: string = 'SHOULD_UPDATE_AFTER_MULTIPLE_ACTIONS';

    /**
     * Setting up classes with an existing reducer should init it with the value by default
     */
    class ValueFromReducer extends connect(store)(BaseClass) {
        @watch(`${localKey}.existing.value`)
        public prop?: string;
    }

    const valueFromReducer: ValueFromReducer = new ValueFromReducer();
    expect(valueFromReducer.prop).toBeUndefined();

    store.dispatch({ type: 'MERGE', data: { [localKey]: { existing: { value: 'placedText' } } } });
    expect(valueFromReducer.prop).toBe('placedText');

    store.dispatch({ type: 'MERGE', data: { [localKey]: { existing: { value: 'otherText' } } } });
    expect(valueFromReducer.prop).toBe('otherText');

    store.dispatch({ type: 'MERGE', data: { [localKey]: { existing: { value: 'moreText' } } } });
    expect(valueFromReducer.prop).toBe('moreText');
});
