import assert from "assert"
import {test, print} from "amen"

{isType, isKind, isFunction, isString, isNumber,
  isEqual, eq, lte} = require "panda-parchment"

import {Method} from "../src"

do ->
  print await test "Multimethods", [
    test "Fibonacci function", ->

      fib = Method.create
        description: "Fibonacci sequence"
        default: -> throw new TypeError "Operand must be a postive integer"

      Method.define fib, (isType Number), (n) -> (fib n - 1) + (fib n - 2)
      Method.define fib, (eq 1), -> 1
      Method.define fib, (eq 2), -> 1

      assert (fib 5) == 5

    test "Polymorphic dispatch", ->

      class A
      class B extends A

      a = new A
      b = new B

      foo = Method.create()
      Method.define foo, (isKind A), -> "foo: A"
      Method.define foo, (isType B), -> "foo: B"
      Method.define foo, (isKind A), (isKind B), -> "foo: A + B"
      Method.define foo, (isKind B), (isKind A), -> "foo: B + A"
      Method.define foo, (eq a), (eq b), -> "foo: a + b"

      assert (foo b) == "foo: B"
      assert (foo a, b) == "foo: a + b"
      assert (foo b, a) == "foo: B + A"
      assert.throws ->
        foo b, a, b

    test "Variadic arguments", ->

      bar = Method.create()
      Method.define bar, String, (-> true), (x, a...) -> a[0]
      Method.define bar, Number, (-> true), (x, a...) -> x

      assert (bar "foo", 1, 2, 3) == 1

    test "Predicate functions", ->

      baz = Method.create()
      Method.define baz, ((x) -> x != 7), -> false
      Method.define baz, ((x) -> x == 7), (x) -> true

      assert (baz 7)
      assert !(baz 6)

    test "Multimethods are functions", ->
      assert isFunction Method.create()

    test "Lookups", ->

      foo = Method.create()

      Method.define foo, isNumber, (x) -> x + x
      Method.define foo, isString, (x) -> false

      f = Method.lookup foo, [ 7 ]
      assert (f 7) == 14

  ]
