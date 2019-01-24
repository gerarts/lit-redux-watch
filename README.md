# lit-redux-watch

[![Build Status - Travis CI](https://img.shields.io/travis/gerarts/lit-redux-watch.svg)](https://travis-ci.org/gerarts/lit-redux-watch)
[![Test Coverage - Code Climate](https://img.shields.io/codeclimate/coverage/gerarts/lit-redux-watch.svg)](https://codeclimate.com/github/gerarts/lit-redux-watch/test_coverage)
[![GPL-3.0](https://img.shields.io/github/license/gerarts/lit-redux-watch.svg)](https://github.com/gerarts/lit-redux-watch/blob/master/LICENSE)
[![NPM](https://img.shields.io/npm/v/lit-redux-watch.svg)](https://www.npmjs.com/package/lit-redux-watch)

Attach [Redux](http://redux.js.org/) store state to properties in [LitElement](https://lit-element.polymer-project.org) with the `@watch()` decorator or a static `watch` getter.

## Install

```
npm i lit-redux-watch
```

## Usage

### Introduction examples

#### With the `@watch` decorator

This example uses TypeScript with decorators to register properties with watchers. Deorators are an experimental feature but can be used by enabling them in your `tsconfig.json`. More information can be found in the [TypeScript Documentation](https://www.typescriptlang.org/docs/handbook/decorators.html).

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

#### `@watch(path[, options][, store])`

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
```

#### `static get watch() {}`

To create a watching property, use the static `watch` getter.

```ts
static get watch() {
    return {
        userFirstName: {
            path: 'user.firstName',
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
    shouldUpdate: function(nextValue, oldValue, path) {
        return nextValue !== "";
    },

    /**
     * A function that is called when the value is updated that allowes
     * the new value to be transformed. Note: this does not transform the
     * value that is passed as the second argument of the shouldUpdate and
     * transform functions.
     */
    transform: function(nextValue, oldValue, path) {
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
