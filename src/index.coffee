lookup = (method, ax) ->
  best = { p: 0, f: method.default }
  bx = if method.map? then (method.map ax...) else ax

  for [tx, f] in method.entries
    if tx.length == bx.length
      p = 0
      bi = ti = 0
      while bi < bx.length && ti < tx.length
        term = tx[ti++]
        arg = bx[bi++]
        if term == arg
          p += 5
        else if term?.constructor == Function
          if arg?
            if term == arg.constructor
              p += 4
            else if (arg instanceof term)
              p += 2
            else if arg.prototype instanceof term
              p += 1
            else if term != Boolean && (term arg) == true
                p += 5
            else
              p = 0
              break
          else if term != Boolean && (term arg) == true
              p += 5
          else
            p = 0
            break
        else
          p = 0
          break
      if p > 0 && p >= best.p
        best = { p, f }

  if best.f.constructor == Function
    best.f
  else
    -> best.f

dispatch = (method, ax) ->
  f = lookup method, ax
  f ax...

create = (options) ->
  m = (args...) -> dispatch m, args
  m.entries = []
  m[k] = v for k, v of options
  m.default ?= -> throw new TypeError "No method matches arguments."
  m

define = (m, terms..., f) ->
  m.entries.push [terms, f]

Method = {create, define, lookup}
module.exports = {Method}
