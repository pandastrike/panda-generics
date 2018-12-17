# Panda Generics

Panda Generics brings generics, also known as multi-methods, to JavaScript. Generics are great for functional programming because they offer multi-argument dispatch. That is, you aren't limited to an implicit first argument as you are with object-oriented methods.

## Installation

`npm i panda-generics`

## Usage

```coffee
import Generics from "panda-generics"
import {isObject} from "panda-parchment"

equal = Generics.create
  name: "equal"
  description: "'Deep' equality operator"
  default: (a, b) -> a == b # fallback to shallow equality

# when comparing objects, recursively check the values
# corresponding to the union of their properties—
# return false on the first inequality
Generics.define equal, isObject, isObject, (a, b) ->
  (a == b) || do ->
    keys = new Set (Object.keys a)..., (Object.keys b)...
    for key from keys
      if ! equal a[key], b[key]
        return false
    true

# when comparing arrays, recursively check values
# after making sure they're the same length
# return false on the first inequality
Generics.define equal, isArray, isArray, (ax, bx) ->
  (ax == bx) || do ->
    return false if ax.length != bx.length
    for i in [0..ax.length]
      if !equal ax[i], bx[i]
        return false
    true

equal "this", "this"  # => true, shallow equality works here
equal { x: 1, y: 2 }, { x: 1, y: 2 } # => true, deep equality
equal [1..5], [1..5] # true, deep equality
equal { x: 1, y: 2}, [1..5] # false
```
