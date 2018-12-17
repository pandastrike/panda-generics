import assert from "assert"
import {test, print, success} from "amen"

{isType, isKind, isFunction, isString, isNumber,
  isEqual, eq, gte, lte} = require "panda-parchment"

import Generic from "../src"
{create, define, lookup} = Generic

do ->

  print await test "Generics", [

    test "Fibonacci function", do ->

      fib = create
        name: "fib"
        description: "Fibonacci sequence"

      define fib, (gte 1), (n) -> (fib n - 1) + (fib n - 2)
      define fib, (eq 1), -> 1
      define fib, (eq 2), -> 1

      [

        test "matches simple predicates", ->
          assert (fib 5) == 5

        test "throws with name/arguments on type error", ->
          console.warn "throws test only works on node 10+"
          assert.throws (-> fib 0),
            message: "fib: Invalid arguments."
            arguments: [ 0 ]

      ]

    test "Polymorphic dispatch", ->

      class A
      class B extends A

      a = new A
      b = new B

      foo = create()
      define foo, (isKind A), -> "foo: A"
      define foo, (isType B), -> "foo: B"
      define foo, (isKind A), (isKind B), -> "foo: A + B"
      define foo, (isKind B), (isKind A), -> "foo: B + A"
      define foo, (eq a), (eq b), -> "foo: a + b"

      assert (foo b) == "foo: B"
      assert (foo a, b) == "foo: a + b"
      assert (foo b, a) == "foo: B + A"
      assert.throws ->
        foo b, a, b

    test "Variadic arguments", ->

      bar = create()
      define bar, String, (-> true), (x, a...) -> a[0]
      define bar, Number, (-> true), (x, a...) -> x

      assert (bar "foo", 1, 2, 3) == 1

    test "Predicate functions", ->

      baz = create()
      define baz, ((x) -> x != 7), -> false
      define baz, ((x) -> x == 7), (x) -> true

      assert (baz 7)
      assert !(baz 6)

    test "Generics are functions", ->
      assert isFunction create()

    test "Lookups", ->

      foo = create()

      define foo, isNumber, (x) -> x + x
      define foo, isString, (x) -> false

      f = lookup foo, [ 7 ]
      assert (f 7) == 14

  ]

  process.exit if success then 0 else 1
