module.exports = memberBerry;

var resultObject = {};
function memberBerry(fn) {
  var wrappedPrimitives = {};
  var map = new WeakMap();
  return function() {
    var currentMap = map;
    for (var index = 0; index < arguments.length; index++) {
      var arg = arguments[index];
      if (typeof arg !== 'object') {
        var key = (typeof arg) + arg
        if (!wrappedPrimitives[key]) wrappedPrimitives[key] = {};
        arg = wrappedPrimitives[key];
      }
      var nextMap = currentMap.get(arg);
      if (!nextMap) {
        nextMap = new WeakMap();
        currentMap.set(arg, nextMap);
      }
      currentMap = nextMap;
    }
    if (!currentMap.has(resultObject)) {
      currentMap.set(resultObject, fn.apply(null, arguments));
    }
    return currentMap.get(resultObject);
  }
}