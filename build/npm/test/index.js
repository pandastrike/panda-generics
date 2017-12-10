"use strict";

var _powerAssertRecorder = function () { function PowerAssertRecorder() { this.captured = []; } PowerAssertRecorder.prototype._capt = function _capt(value, espath) { this.captured.push({ value: value, espath: espath }); return value; }; PowerAssertRecorder.prototype._expr = function _expr(value, source) { var capturedValues = this.captured; this.captured = []; return { powerAssertContext: { value: value, events: capturedValues }, source: source }; }; return PowerAssertRecorder; }();

var _powerAssert = require("power-assert");

var _powerAssert2 = _interopRequireDefault(_powerAssert);

var _amen = require("amen");

var _lib = require("../lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var eq, isEqual, isFunction, isKind, isNumber, isString, isType, lte;

({ isType, isKind, isFunction, isString, isNumber, isEqual, eq, lte } = require("fairmont-helpers"));

_asyncToGenerator(function* () {
  return (0, _amen.print)((yield (0, _amen.test)("Multimethods", [(0, _amen.test)("Fibonacci function", function () {
    var _rec = new _powerAssertRecorder();

    var fib;
    fib = _lib.Method.create({
      description: "Fibonacci sequence",
      default: function () {
        throw new TypeError("Operand must be a postive integer");
      }
    });
    _lib.Method.define(fib, isType(Number), function (n) {
      return fib(n - 1) + fib(n - 2);
    });
    _lib.Method.define(fib, eq(1), function () {
      return 1;
    });
    _lib.Method.define(fib, eq(2), function () {
      return 1;
    });
    return (0, _powerAssert2.default)(_rec._expr(_rec._capt(_rec._capt(fib(5), "arguments/0/left") === 5, "arguments/0"), {
      content: "assert(fib(5) === 5)",
      filepath: "index.coffee",
      line: 21
    }));
  }), (0, _amen.test)("Polymorphic dispatch", function () {
    var _rec2 = new _powerAssertRecorder(),
        _rec3 = new _powerAssertRecorder(),
        _rec4 = new _powerAssertRecorder();

    var A, B, a, b, foo;
    A = class A {};
    B = class B extends A {};
    a = new A();
    b = new B();
    foo = _lib.Method.create();
    _lib.Method.define(foo, isKind(A), function () {
      return "foo: A";
    });
    _lib.Method.define(foo, isType(B), function () {
      return "foo: B";
    });
    _lib.Method.define(foo, isKind(A), isKind(B), function () {
      return "foo: A + B";
    });
    _lib.Method.define(foo, isKind(B), isKind(A), function () {
      return "foo: B + A";
    });
    _lib.Method.define(foo, eq(a), eq(b), function () {
      return "foo: a + b";
    });
    (0, _powerAssert2.default)(_rec2._expr(_rec2._capt(_rec2._capt(foo(_rec2._capt(b, "arguments/0/left/arguments/0")), "arguments/0/left") === "foo: B", "arguments/0"), {
      content: "assert(foo(b) === \"foo: B\")",
      filepath: "index.coffee",
      line: 38
    }));
    (0, _powerAssert2.default)(_rec3._expr(_rec3._capt(_rec3._capt(foo(_rec3._capt(a, "arguments/0/left/arguments/0"), _rec3._capt(b, "arguments/0/left/arguments/1")), "arguments/0/left") === "foo: a + b", "arguments/0"), {
      content: "assert(foo(a, b) === \"foo: a + b\")",
      filepath: "index.coffee",
      line: 39
    }));
    (0, _powerAssert2.default)(_rec4._expr(_rec4._capt(_rec4._capt(foo(_rec4._capt(b, "arguments/0/left/arguments/0"), _rec4._capt(a, "arguments/0/left/arguments/1")), "arguments/0/left") === "foo: B + A", "arguments/0"), {
      content: "assert(foo(b, a) === \"foo: B + A\")",
      filepath: "index.coffee",
      line: 40
    }));
    return _powerAssert2.default.throws(function () {
      return foo(b, a, b);
    });
  }), (0, _amen.test)("Variadic arguments", function () {
    var _rec5 = new _powerAssertRecorder();

    var bar;
    bar = _lib.Method.create();
    _lib.Method.define(bar, String, function () {
      return true;
    }, function (x, ...a) {
      return a[0];
    });
    _lib.Method.define(bar, Number, function () {
      return true;
    }, function (x, ...a) {
      return x;
    });
    return (0, _powerAssert2.default)(_rec5._expr(_rec5._capt(_rec5._capt(bar("foo", 1, 2, 3), "arguments/0/left") === 1, "arguments/0"), {
      content: "assert(bar(\"foo\", 1, 2, 3) === 1)",
      filepath: "index.coffee",
      line: 50
    }));
  }), (0, _amen.test)("Predicate functions", function () {
    var _rec6 = new _powerAssertRecorder(),
        _rec7 = new _powerAssertRecorder();

    var baz;
    baz = _lib.Method.create();
    _lib.Method.define(baz, function (x) {
      return x !== 7;
    }, function () {
      return false;
    });
    _lib.Method.define(baz, function (x) {
      return x === 7;
    }, function (x) {
      return true;
    });
    (0, _powerAssert2.default)(_rec6._expr(_rec6._capt(baz(7), "arguments/0"), {
      content: "assert(baz(7))",
      filepath: "index.coffee",
      line: 58
    }));
    return (0, _powerAssert2.default)(_rec7._expr(_rec7._capt(!_rec7._capt(baz(6), "arguments/0/argument"), "arguments/0"), {
      content: "assert(!baz(6))",
      filepath: "index.coffee",
      line: 59
    }));
  }), (0, _amen.test)("Multimethods are functions", function () {
    var _rec8 = new _powerAssertRecorder();

    return (0, _powerAssert2.default)(_rec8._expr(_rec8._capt(isFunction(_rec8._capt(_rec8._capt(_lib.Method, "arguments/0/arguments/0/callee/object").create(), "arguments/0/arguments/0")), "arguments/0"), {
      content: "assert(isFunction(Method.create()))",
      filepath: "index.coffee",
      line: 62
    }));
  }), (0, _amen.test)("Lookups", function () {
    var _rec9 = new _powerAssertRecorder();

    var f, foo;
    foo = _lib.Method.create();
    _lib.Method.define(foo, isNumber, function (x) {
      return x + x;
    });
    _lib.Method.define(foo, isString, function (x) {
      return false;
    });
    f = _lib.Method.lookup(foo, [7]);
    return (0, _powerAssert2.default)(_rec9._expr(_rec9._capt(_rec9._capt(f(7), "arguments/0/left") === 14, "arguments/0"), {
      content: "assert(f(7) === 14)",
      filepath: "index.coffee",
      line: 72
    }));
  })])));
})();