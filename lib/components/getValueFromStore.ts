import { Action, Store } from 'redux';
import { getByChain } from './getByChain';
import { WatchSource } from './types';

// Get value from a store by a WatchStore
export const getValueFromStore: <S, A extends Action>(store: Store<S, A>, source: WatchSource<S>) => any = <S, A extends Action>(
    store: Store<S, A>,
    source: WatchSource<S>,
): any => {
    const nextState: S = store.getState();

    return typeof source === 'function' ? source(nextState) : getByChain(nextState, source.split('.'));
};
