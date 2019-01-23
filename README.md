# lit-redux-watch

[![Build Status - Travis CI](https://img.shields.io/travis/gerarts/lit-redux-watch.svg)](https://travis-ci.org/gerarts/lit-redux-watch)
[![Test Coverage - Code Climate](https://img.shields.io/codeclimate/coverage/gerarts/lit-redux-watch.svg)](https://codeclimate.com/github/gerarts/lit-redux-watch/test_coverage)
![GPL-3.0](https://img.shields.io/github/license/gerarts/lit-redux-watch.svg)
[![NPM](https://img.shields.io/npm/v/lit-redux-watch.svg)](https://www.npmjs.com/package/lit-redux-watch)

Attach [Redux](http://redux.js.org/) store state to properties in [LitElement](https://lit-element.polymer-project.org) with the `@watch()` decorator

## Install

```
npm i --save lit-redux-watch
```

## Usage

### Decorator with TypeScript

```ts
class UserPage extends connect(store)(LitElement) {
    @watch('user.name')
    userName?: string;
    
    render() {
      return html`
        <div>Name: ${this.userName}</div>
      `
    }
}
```

### Simple method

```js
class UserPage extends connect(store)(LitElement) {
    
    static get watch() {
        return {
            userName: {
                path: 'user.name'
            }
        }
    }

    render() {
      return html`
        <div>Name: ${this.userName}</div>
      `
    }
}
```
