import { Store } from 'redux';
import { getByChain } from './getByChain';
import { WatchSource } from './types';

// Get value from a store by a WatchStore
export const getValueFromStore: (store: Store, source: WatchSource) => any = (store: Store, source: WatchSource): any => {
    const nextState: any = store.getState();

    return typeof source === 'function' ? source(nextState) : getByChain(nextState, source.split('.'));
};
