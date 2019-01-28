import { createSelector } from 'reselect';
import { getValueFromStore } from './getValueFromStore';
import { DefaultState, store } from './helpers.test';

test('Get value with path-string', () => {
    expect(getValueFromStore(store, 'defaultReducer')).toEqual({ nested: { values: 'data' } });
});

test('Get value with getter function', () => {
    expect(getValueFromStore(store, (state: DefaultState) => state.defaultReducer)).toEqual({ nested: { values: 'data' } });
});

test('Get value with reselector', () => {
    expect(getValueFromStore(store, createSelector(
        (state: DefaultState) => state.defaultReducer,
        (defaultReducerData: DefaultState['defaultReducer']) => defaultReducerData.nested,
    ))).toEqual({ values: 'data' });
});
