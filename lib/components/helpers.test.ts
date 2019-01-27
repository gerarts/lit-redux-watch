import { AnyAction, createStore, Reducer, Store } from 'redux';

export interface DefaultState {
    defaultReducer: {
        nested: {
            values: string;
        };
    };
}

const defaultState: DefaultState = {
    defaultReducer: {
        nested: {
            values: 'data',
        },
    },
};

const reducer: Reducer = (state: DefaultState = defaultState, a: AnyAction): any => {
    switch (a.type) {
        case 'MERGE':
            return {
                ...(state || {}),
                ...(a.data || {}),
            };
        default:
            return state || {};
    }
};

/**
 * Small redux store to be used in tests
 */
export const store: Store = createStore(reducer);

test('Should be a store', () => {
    expect(typeof store.getState).toBe('function');
});
