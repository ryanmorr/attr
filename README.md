# attr

[![Version Badge][version-image]][project-url]
[![License][license-image]][license-url]
[![Build Status][build-image]][build-url]

> The ultimate DOM attribute, property, style, data, and event setter

## Install

Download the [CJS](https://github.com/ryanmorr/attr/raw/master/dist/attr.cjs.js), [ESM](https://github.com/ryanmorr/attr/raw/master/dist/attr.esm.js), [UMD](https://github.com/ryanmorr/attr/raw/master/dist/attr.umd.js) versions or install via NPM:

``` sh
npm install @ryanmorr/attr
```

## Usage

Import the library:

``` javascript
import attr from '@ryanmorr/attr';
```

Add an attribute:

``` javascript
attr(element, 'id', 'foo');
```

Add multiple attributes:

``` javascript
attr(element, {
    id: 'foo',
    class: 'bar baz qux'
});
```

Remove an attribute with null or undefined:

``` javascript
attr(element, 'class', null);
```

Set boolean attributes and properties:

``` javascript
attr(checkbox, 'checked', true);
attr(textfield, 'value', 'foo bar');
attr(element, 'innerHTML', '<span></span>');
```

Set styles as a string:

``` javascript
attr(element, 'style', 'width: 100px; height: 100px;');
```

Set styles as an object:

``` javascript
attr(element, 'style', {
    width: 100,
    height: 100
});
```

Supports CSS custom properties:

``` javascript
attr(element, 'style', 'color: var(--color)');

attr(element, '--color', 'red');
attr(element, '--color', 'blue');
```

Add an event listener:

``` javascript
attr(element, 'onclick', (e) => {
    // Handle click event
});
```

Set data attributes (will automatically convert objects to string):

``` javascript
attr(element, 'data', {
    str: 'foo',
    num: 123,
    bool: true,
    object: {foo: 'bar'},
    array: [1, 2, 3]
});
```

Supports functions that return the new value (except when adding an event!). The element and the current value of the attribute are provided as the only 2 parameters:

``` javascript
attr(element, 'class', 'foo bar baz');
element.className; //=> "foo bar baz"
attr(element, 'class', (el, value) => value.split(' ').filter(cls => cls !== 'bar'));
element.className; //=> "foo baz"

attr(element, 'style', 'width: 100px; height: 100px;');
element.style.cssText; //=> "width: 100px; height: 100px"
attr(element, 'style', (el, value) => Object.assign({}, value, {height: null}));
element.style.cssText; //=> "width: 100px;"

attr(element, 'data', {foo: [1, 2, 3]});
element.dataset.foo; //=> "[1,2,3]"
attr(element, 'data', (el, value) => ({foo: value.foo.filter(val => val !== 2)}));
element.dataset.foo; //=> "[1,3]"
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/attr
[version-image]: https://img.shields.io/github/package-json/v/ryanmorr/attr?color=blue&style=flat-square
[build-url]: https://travis-ci.com/github/ryanmorr/attr
[build-image]: https://img.shields.io/travis/com/ryanmorr/attr?style=flat-square
[license-image]: https://img.shields.io/github/license/ryanmorr/attr?color=blue&style=flat-square
[license-url]: UNLICENSE