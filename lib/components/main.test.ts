// tslint:disable max-classes-per-file
import ava, { ExecutionContext, TestInterface } from 'ava';
import { LitElement } from 'lit-element';
import { AnyAction, createStore, Store } from 'redux';
import { connect } from './connect';
import { watch } from './watch';

interface Context {
    tracker: string;
}
const test: TestInterface<Context> = <TestInterface<Context>>ava;

const store: Store = createStore((s: {}, a: AnyAction): any => a.type ? s || {} : {});

/**
 * Docs
 */
class BaseClass extends LitElement {
    public baseProp: string = 'base';
}

test('Watcher connected store should not throw', (t: ExecutionContext<Context>) => {
    t.notThrows(() => {
        /**
         * Setting up classes with watchers with store as parameter should not throw
         */
        class ExtendedClass extends BaseClass {
            @watch('a.random.path', store)
            public watchedProp: string = 'watched';
        }

        // Doing something with the class.
        return new ExtendedClass();
    });
});

test('Mixin connected store should not throw', (t: ExecutionContext<Context>) => {
    t.notThrows(() => {
        /**
         * Setting up classes with watchers with mixin connected store should not throw
         */
        class MixinExtendedClass extends connect(store)(BaseClass) {
            @watch('a.random.path')
            public watchedProp: string = 'watched';
        }

        // Doing something with the class.
        return new MixinExtendedClass();
    });
});

test('Missing store throws', (t: ExecutionContext<Context>) => {
    t.throws(() => {
        /**
         * Setting up classes with watchers with missing store should throw
         */
        class MissingStoreThrows extends BaseClass {
            @watch('another.path')
            public prop: string = 'default';
        }

        // Doing something with the class. The return is never reached.
        return new MissingStoreThrows();
    });
});
