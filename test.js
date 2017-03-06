var memeberBerry = require('./')
var expect = require('expect')

describe('memeber-berry', function() {
  var id;
  var func;
  var membered;

  beforeEach(function() {
    id = 0;
    func = function() { return ++id; };
    membered = memeberBerry(func);
  });

  it('member one obj?', function() {
    var obj = {};
    expect(membered(obj)).toEqual(1);
    expect(membered(obj)).toEqual(1, 'ooh, I member!');
  });

  it('member two different objs?', function() {
    var obj1 = {};
    var obj2 = {};
    expect(membered(obj1)).toEqual(1);
    expect(membered(obj2)).toEqual(2);
    expect(membered(obj1)).toEqual(1, 'ooh, I member!');
    expect(membered(obj2)).toEqual(2, 'ooh, I member!');
  });

  it('member multiple args?', function() {
    var obj1 = {};
    var obj2 = {};
    expect(membered(obj1, obj2)).toEqual(1);
    expect(membered(obj1, obj2)).toEqual(1, 'ooh, I member!');
  });

  it('member different multiple args?', function() {
    var obj1 = {};
    var obj2 = {};
    expect(membered(obj1, obj2)).toEqual(1);
    expect(membered(obj2, obj1)).toEqual(2);
    expect(membered(obj1, obj2)).toEqual(1, 'ooh, I member!');
    expect(membered(obj2, obj1)).toEqual(2, 'ooh, I member!');
  });

  it('member different similar primitives?', function() {
    expect(membered(1)).toEqual(1);
    expect(membered(1)).toEqual(1, 'ooh, I member!');
    expect(membered('1')).toEqual(2);
  });

  it('member in O(n)?', function() {
    var originalWeakMap = WeakMap;
    var operations = 0;
    WeakMap = function() {
      var wm = new originalWeakMap();
      return {
        has: function(key) {
          operations++;
          return wm.has(key);
        },
        get: function(key) {
          operations++;
          return wm.get(key);
        },
        set: function(key, value) {
          operations++;
          return wm.set(key, value);
        },
      }
    };
    membered = memeberBerry(func);
    var lastArgs;
    func = function() {
      lastArgs = [].slice.call(arguments);
      return ++id;
    };
    var arraySameContents = function(arr1, arr2) {
      expect(arr1.length).toEqual(arr2.length);
      for (var index = 0; index < arr1.length; index++) {
        expect(arr1[index]).toBe(arr2[index]);
      }
    };
    membered = memeberBerry(func);
    var objects = Array(100).join('.').split('.').map(function() { return {}; });
    expect(membered.apply(null, objects)).toEqual(1);
    expect(membered.apply(null, objects)).toEqual(1, 'ooh, I member!');
    arraySameContents(objects, lastArgs);
    expect(operations).toBeLessThan(310);
    expect(membered.apply(null, objects.concat({}))).toEqual(2);
    expect(lastArgs.length).toNotEqual(objects.length);
    expect(operations).toBeLessThan(420);
  });

})