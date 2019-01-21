// tslint:disable max-classes-per-file
import { getByChain } from './getByChain';

interface Context {
    deepPath: string[];
    noPath: string[];
    shallowPath: string[];
}

let context: Context;

beforeAll(() => {
    context = {
        deepPath: ['path','has','multiple','nodes'],
        noPath: [],
        shallowPath: ['path'],
    };
});

test('Get from undefined no path yields undefined', () => {
    expect(getByChain(undefined, context.noPath)).toEqual(undefined);
});

test('Get from undefined shallow path yields undefined', () => {
    expect(getByChain(undefined, context.shallowPath)).toEqual(undefined);
});

test('Get from undefined deep path yields undefined', () => {
    expect(getByChain(undefined, context.deepPath)).toEqual(undefined);
});

test('Get from null no path yields null', () => {
    expect(getByChain(null, context.noPath)).toEqual(null);
});

test('Get from null shallow path yields undefined', () => {
    expect(getByChain(null, context.shallowPath)).toEqual(undefined);
});

test('Get from null deep path yields undefined', () => {
    expect(getByChain(null, context.deepPath)).toEqual(undefined);
});

test('Get from 0 no path yields 0', () => {
    expect(getByChain(0, context.noPath)).toEqual(0);
});

test('Get from 0 shallow path yields undefined', () => {
    expect(getByChain(0, context.shallowPath)).toEqual(undefined);
});

test('Get from 0 deep path yields undefined', () => {
    expect(getByChain(0, context.deepPath)).toEqual(undefined);
});

test('Get from "" no path yields ""', () => {
    expect(getByChain('', context.noPath)).toEqual('');
});

test('Get from "" shallow path yields undefined', () => {
    expect(getByChain('', context.shallowPath)).toEqual(undefined);
});

test('Get from "" deep path yields undefined', () => {
    expect(getByChain('', context.deepPath)).toEqual(undefined);
});

test('Get from [] no path yields []', () => {
    expect(getByChain([], context.noPath)).toEqual([]);
});

test('Get from [] shallow path yields undefined', () => {
    expect(getByChain([], context.shallowPath)).toEqual(undefined);
});

test('Get from [] deep path yields undefined', () => {
    expect(getByChain([], context.deepPath)).toEqual(undefined);
});

test('Get from {path: "abc"} no path yields {path: "abc"}', () => {
    expect(getByChain({ path: 'abc' }, context.noPath)).toEqual({ path: 'abc' });
});

test('Get from {path: "abc"} shallow path yields "abc"', () => {
    expect(getByChain({ path: 'abc' }, context.shallowPath)).toEqual('abc');
});

test('Get from {path: "abc"} deep path yields undefined', () => {
    expect(getByChain({ path: 'abc' }, context.deepPath)).toEqual(undefined);
});

test('Get from {pathNotExist: "abc"} no path yields {pathNotExist: "abc"}', () => {
    expect(getByChain({ pathNotExist: 'abc' }, context.noPath)).toEqual({ pathNotExist: 'abc' });
});

test('Get from {pathNotExist: "abc"} shallow path yields "abc"', () => {
    expect(getByChain({ pathNotExist: 'abc' }, context.shallowPath)).toEqual(undefined);
});

test('Get from {pathNotExist: "abc"} deep path yields undefined', () => {
    expect(getByChain({ pathNotExist: 'abc' }, context.deepPath)).toEqual(undefined);
});

test('Get from nested node', () => {
    expect(
        getByChain({ path: { has: { multiple: { nodes: 'data' } } } }, context.deepPath),
    ).toEqual('data');
});

test('Get from beyond nested node', () => {
    expect(getByChain({ path: { has: { multiple: 'data' } } }, context.deepPath)).toEqual(undefined);
});

test('Get object from nested', () => {
    expect(
        getByChain({ path: { has: { multiple: { nodes: { data: 'here' } } } } }, context.deepPath),
    ).toEqual({ data: 'here' });
});

test('Get array from nested', () => {
    expect(
        getByChain({ path: { has: { multiple: { nodes: ['data', 'here'] } } } }, context.deepPath),
    ).toEqual(['data', 'here']);
});
