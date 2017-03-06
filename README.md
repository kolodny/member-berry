member-berry
===

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]

### Memoize a function of n args with O(n) recall and no memory leaks.

This function is similar to lodash.memoize, the main difference
is that it memoizes any number of arguments, makes sure not to
leak any memory while maintaining a complexity of
O(`arguments.length`).

## Usage

```js
import memeberBerry from 'member-berry';
var hashCode = function(str) {
  var hash = 0, i, chr, len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
function computeHash() {
  console.log('doing a slow calculation');
  var hash = 0
  for (var i = 0; i < arguments.length; i++) {
    hash = hashCode(hash + arguments[index])
  }
  return hash;
}
var memoized = memberBerry(computeHash);
memoized("test") // calculates
memoized("test") // doesn't recalculate

var obj = {};
memoized(obj) // calculates
memoized(obj) // doesn't recalculate

memoized("test", obj) // calculates
memoized("test", obj) // doesn't recalculate
```

### Implementation
The technique used to achive O(n) lookup, is to use a trie-like
data structure to store the cached values. Here's a basic
snippet with accompanying explaination:


```js
var concat = function(a, b, c) { return a + b + c; };
var memoized = memberBerry(concat);

memoized(1, 2, 3)
/* memoized internal cache looks something like this:
{
  1: {
    2: {
      3: {
        result: "123"
      }
    }
  }
}
*/
```

`member-berry` uses weakmaps to avoid holding onto object
references longer than needed. Weakmaps can't use primitive
values as keys so there's also a "wrapped" object associated
with primitives.

[npm-image]: https://img.shields.io/npm/v/member-berry.svg?style=flat-square
[npm-url]: https://npmjs.org/package/member-berry
[travis-image]: https://img.shields.io/travis/kolodny/member-berry.svg?style=flat-square
[travis-url]: https://travis-ci.org/kolodny/member-berry
[coveralls-image]: https://img.shields.io/coveralls/kolodny/member-berry.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/kolodny/member-berry
[downloads-image]: http://img.shields.io/npm/dm/member-berry.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/member-berry
