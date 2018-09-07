"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _amen = require("amen");

var _src = require("../src");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var eq, isEqual, isFunction, isKind, isNumber, isString, isType, lte;

({ isType, isKind, isFunction, isString, isNumber, isEqual, eq, lte } = require("panda-parchment"));

_asyncToGenerator(function* () {
  return (0, _amen.print)((yield (0, _amen.test)("Multimethods", [(0, _amen.test)("Fibonacci function", function () {
    var fib;
    fib = _src.Method.create({
      description: "Fibonacci sequence",
      default: function () {
        throw new TypeError("Operand must be a postive integer");
      }
    });
    _src.Method.define(fib, isType(Number), function (n) {
      return fib(n - 1) + fib(n - 2);
    });
    _src.Method.define(fib, eq(1), function () {
      return 1;
    });
    _src.Method.define(fib, eq(2), function () {
      return 1;
    });
    return (0, _assert2.default)(fib(5) === 5);
  }), (0, _amen.test)("Polymorphic dispatch", function () {
    var A, B, a, b, foo;
    A = class A {};
    B = class B extends A {};
    a = new A();
    b = new B();
    foo = _src.Method.create();
    _src.Method.define(foo, isKind(A), function () {
      return "foo: A";
    });
    _src.Method.define(foo, isType(B), function () {
      return "foo: B";
    });
    _src.Method.define(foo, isKind(A), isKind(B), function () {
      return "foo: A + B";
    });
    _src.Method.define(foo, isKind(B), isKind(A), function () {
      return "foo: B + A";
    });
    _src.Method.define(foo, eq(a), eq(b), function () {
      return "foo: a + b";
    });
    (0, _assert2.default)(foo(b) === "foo: B");
    (0, _assert2.default)(foo(a, b) === "foo: a + b");
    (0, _assert2.default)(foo(b, a) === "foo: B + A");
    return _assert2.default.throws(function () {
      return foo(b, a, b);
    });
  }), (0, _amen.test)("Variadic arguments", function () {
    var bar;
    bar = _src.Method.create();
    _src.Method.define(bar, String, function () {
      return true;
    }, function (x, ...a) {
      return a[0];
    });
    _src.Method.define(bar, Number, function () {
      return true;
    }, function (x, ...a) {
      return x;
    });
    return (0, _assert2.default)(bar("foo", 1, 2, 3) === 1);
  }), (0, _amen.test)("Predicate functions", function () {
    var baz;
    baz = _src.Method.create();
    _src.Method.define(baz, function (x) {
      return x !== 7;
    }, function () {
      return false;
    });
    _src.Method.define(baz, function (x) {
      return x === 7;
    }, function (x) {
      return true;
    });
    (0, _assert2.default)(baz(7));
    return (0, _assert2.default)(!baz(6));
  }), (0, _amen.test)("Multimethods are functions", function () {
    return (0, _assert2.default)(isFunction(_src.Method.create()));
  }), (0, _amen.test)("Lookups", function () {
    var f, foo;
    foo = _src.Method.create();
    _src.Method.define(foo, isNumber, function (x) {
      return x + x;
    });
    _src.Method.define(foo, isString, function (x) {
      return false;
    });
    f = _src.Method.lookup(foo, [7]);
    return (0, _assert2.default)(f(7) === 14);
  })])));
})();