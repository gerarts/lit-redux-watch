// tslint:disable max-classes-per-file
import ava, { ExecutionContext, TestInterface } from 'ava';
import { getByChain } from './getByChain';

interface Context {
    deepPath: string[];
    noPath: string[];
    shallowPath: string[];
}
const test: TestInterface<Context> = <TestInterface<Context>>ava;

test.before('Setup paths', (t: ExecutionContext<Context>) => {
    t.context = {
        deepPath: ['path','has','multiple','nodes'],
        noPath: [],
        shallowPath: ['path'],
    };
});

test('Get from undefined no path yields undefined', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain(undefined, t.context.noPath), undefined);
});

test('Get from undefined shallow path yields undefined', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain(undefined, t.context.shallowPath), undefined);
});

test('Get from undefined deep path yields undefined', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain(undefined, t.context.deepPath), undefined);
});

test('Get from null no path yields null', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain(null, t.context.noPath), null);
});

test('Get from null shallow path yields undefined', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain(null, t.context.shallowPath), undefined);
});

test('Get from null deep path yields undefined', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain(null, t.context.deepPath), undefined);
});

test('Get from 0 no path yields 0', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain(0, t.context.noPath), 0);
});

test('Get from 0 shallow path yields undefined', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain(0, t.context.shallowPath), undefined);
});

test('Get from 0 deep path yields undefined', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain(0, t.context.deepPath), undefined);
});

test('Get from "" no path yields ""', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain('', t.context.noPath), '');
});

test('Get from "" shallow path yields undefined', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain('', t.context.shallowPath), undefined);
});

test('Get from "" deep path yields undefined', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain('', t.context.deepPath), undefined);
});

test('Get from [] no path yields []', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain([], t.context.noPath), []);
});

test('Get from [] shallow path yields undefined', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain([], t.context.shallowPath), undefined);
});

test('Get from [] deep path yields undefined', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain([], t.context.deepPath), undefined);
});

test('Get from {path: "abc"} no path yields {path: "abc"}', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain({ path: 'abc' }, t.context.noPath), { path: 'abc' });
});

test('Get from {path: "abc"} shallow path yields "abc"', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain({ path: 'abc' }, t.context.shallowPath), 'abc');
});

test('Get from {path: "abc"} deep path yields undefined', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain({ path: 'abc' }, t.context.deepPath), undefined);
});

test('Get from {pathNotExist: "abc"} no path yields {pathNotExist: "abc"}', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain({ pathNotExist: 'abc' }, t.context.noPath), { pathNotExist: 'abc' });
});

test('Get from {pathNotExist: "abc"} shallow path yields "abc"', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain({ pathNotExist: 'abc' }, t.context.shallowPath), undefined);
});

test('Get from {pathNotExist: "abc"} deep path yields undefined', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain({ pathNotExist: 'abc' }, t.context.deepPath), undefined);
});

test('Get from nested node', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain({ path: { has: { multiple: { nodes: 'data' } } } }, t.context.deepPath), 'data');
});

test('Get from beyond nested node', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain({ path: { has: { multiple: 'data' } } }, t.context.deepPath), undefined);
});

test('Get object from nested', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain({ path: { has: { multiple: { nodes: { data: 'here' } } } } }, t.context.deepPath), { data: 'here' });
});

test('Get array from nested', (t: ExecutionContext<Context>) => {
    t.deepEqual(getByChain({ path: { has: { multiple: { nodes: ['data', 'here'] } } } }, t.context.deepPath), ['data', 'here']);
});
