import { AnyAction, createStore, Reducer, Store } from 'redux';

const defaultState: {[key: string]: any} = {
    defaultReducer: {
        nested: {
            values: 'data',
        },
    },
};

const reducer: Reducer = (state: {[key: string]: any} = defaultState, a: AnyAction): any => {
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

export const store: Store = createStore(reducer);

test('Should be a store', () => {
    expect(typeof store.getState).toBe('function');
});
