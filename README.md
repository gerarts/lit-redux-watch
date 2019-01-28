# lit-redux-watch

[![Build Status - Travis CI](https://img.shields.io/travis/gerarts/lit-redux-watch.svg)](https://travis-ci.org/gerarts/lit-redux-watch)
[![Test Coverage - Code Climate](https://img.shields.io/codeclimate/coverage/gerarts/lit-redux-watch.svg)](https://codeclimate.com/github/gerarts/lit-redux-watch/test_coverage)
[![GPL-3.0](https://img.shields.io/github/license/gerarts/lit-redux-watch.svg)](https://github.com/gerarts/lit-redux-watch/blob/master/LICENSE)
[![NPM](https://img.shields.io/npm/v/lit-redux-watch.svg)](https://www.npmjs.com/package/lit-redux-watch)

Attach [Redux](http://redux.js.org/) store state and [Reselect](https://github.com/reduxjs/reselect) selectors to properties in [LitElement](https://lit-element.polymer-project.org) with the `@watch()` decorator or a static `watch` getter.

## Install

```
npm i lit-redux-watch
```

## Usage

### Introduction examples

#### With the `@watch` decorator

This example uses TypeScript with decorators to register properties with watchers. Decorators are an experimental feature but can be used by enabling them in your `tsconfig.json`. More information can be found in the [TypeScript Documentation](https://www.typescriptlang.org/docs/handbook/decorators.html).

The [TC39 proposed decorators](http://github.com/tc39/proposal-decorators) which are currently in [Stage 2](https://github.com/tc39/proposals#stage-2) will be supported in the future.

```ts
import {LitElement, html} from 'lit-element';
import {connect, watch} from 'lit-redux-watch';
import {store} from './store'; // Your redux store

class UserPage extends connect(store)(LitElement) {

    @watch('user.name')
    userName?: string;
    
    render() {
      return html`
        <div>Name: ${this.userName}</div>
      `;
    }

}
```

#### With a static `watch` getter

```js
import {LitElement, html} from 'lit-element';
import {connect} from 'lit-redux-watch';
import {store} from './store'; // Your redux store

class UserPage extends connect(store)(LitElement) {

    static get watch() {
        return {
            userName: 'user.name'
        }
    }

    render() {
      return html`
        <div>Name: ${this.userName}</div>
      `;
    }

}
```

### Setup

#### `connect([store[, options]])`

To use lit-redux-watch in a class, use the `connect` mixin.

```ts
class MyElement extends connect()(LitElement) {}

class MyElement extends connect(store)(LitElement) {}

class MyElement extends connect(store, options)(LitElement) {}
```

When no store is provided via `connect` one must be provided via `static get watch`/`@watch`.

#### `@watch(source[, options][, store])`

To create a watching property, use the `@watch` decorator.

```ts
@watch('user.firstName')
userFirstName?: string;

@watch('user.lastName', options)
userLastName?: string;

@watch('user.email', store)
userEmail?: string;

@watch('user.address', options, store)
userAddress?: string;

// Or a function
@watch((state) => state.user.phone || state.user.mobile)
userPhoneNumber?: string;

// Or a reselect selector
@watch(userLanguagesSelector)
userLanguages?: string[];
```

See the sections on [sources](#source) and [options](#options) for more information about what sources and options can be used.

#### `static get watch() {}`

To create a watching property, use the static `watch` getter.

```ts
static get watch() {
    return {
        userFirstName: {
            source: 'user.firstName',
            store: store,

            // Options are added in the same object
            noInit: true,
            transform: (next) => next.trim(),
        }
    }
}
```

###### NOTE

Options and stores provided via `static get watch`/`@watch` override those provided in the `connect` mixin.

### Source

#### Path-string source

A simple path-string can be used as a source.

```ts
'shop.items'
```

Path-strings are like object paths, so the above maps to:

```ts
store.getState().shop.items
```

The difference is that if the string-path can not be traversed all the way `undefined` is returned instead of an error being thrown.

#### Function source

Instead of a path-string a function can also be used as source.

```ts
@watch((state) => state.user.firstName)
userFirstName?: string;
```

The function gets called with the store state as the first parameter and should return the value for lit-redux-watch to use.

#### [Reselect](https://github.com/reduxjs/reselect) selector source

[Reselect](https://github.com/reduxjs/reselect) selectors can also be used as a source since they return a function compatible with the pattern mentioned in [Function source](#function-source).

Simply create a selector...

```ts
const shopItemsSelector = (state) => state.shop.items;
const subtotalSelector = createSelector(
    shopItemsSelector,
    items => items.reduce((acc, item) => acc + item.value, 0),
);
```

...and use it as your watch source.

```ts
@watch(subtotalSelector)
subtotal?: number;
```

For more information about [Reselect](https://github.com/reduxjs/reselect) see the [reselect documentation](https://github.com/reduxjs/reselect#reselect).

### Options

These are the available options for watchers.

```ts
{
    /**
     * Override the default strict === compare function. If you need deep
     * equal you can use epoberezkin/fast-deep-equal.
     */
    compare: function(a, b) {
        return a === b;
    },

    /**
     * Indicates whether the value should be loaded from redux on init. By
     * default the value will be loaded when the property is initialized
     * but this can be disabled by setting `noInit: true`.
     */
    noInit: false,

    /**
     * A function that is called when a new value is found that should
     * return a boolean to indicate whether the value should be updated.
     */
    shouldUpdate: function(nextValue, oldValue, source) {
        return nextValue !== "";
    },

    /**
     * A function that is called when the value is updated that allows
     * the new value to be transformed. Note: this does not transform the
     * value that is passed as the second argument of the shouldUpdate and
     * transform functions.
     */
    transform: function(nextValue, oldValue, source) {
        return nextValue.trim();
    }
}
```

## Credits

lit-redux-watch is inspired by [jprichardson/redux-watch](https://github.com/jprichardson/redux-watch) and the property registration from [Polymer/lit-element](https://github.com/Polymer/lit-element)

## Coming soon

- The [TC39 proposed decorators](http://github.com/tc39/proposal-decorators) which are currently in [Stage 2](https://github.com/tc39/proposals#stage-2) will be supported in the future.
- Maybe dispatching actions back to redux on property `set` will be added. Currently looking into this.

## License

[GPL-3.0](https://github.com/gerarts/lit-redux-watch/blob/master/LICENSE)

Made by Paul Gerarts
