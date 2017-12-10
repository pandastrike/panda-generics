lookup = (m, ax) ->

  # go through each definition in our lookup 'table'
  for [terms, f] in m.entries

    # there must be at least one argument per term
    # (variadic terms can consume multiple arguments,
    # so the converse is not true)
    continue if terms.length > ax.length

    # we can't have a match if we don't match any terms
    match = false

    # each argument must be consumed
    i = 0
    while i < ax.length

      # if there's no corresponding term, we have leftover
      # arguments with no term to consume them, so move on
      if !(term = terms[i])?
        match = false
        break

      # if the term may be variadic (indicated by taking 0 arguments)
      # try the term with the remaining arguments
      if term.length == 0
        match = term ax[i..]...
        break

      # otherwise, we have the default case, where we try to match
      # the next argument with the next term
      break if !(match = term ax[i++])

    # if we ended up with a match, just return the corresponding fn
    return f if match

  # if exit the loop without returning a match, return the default
  m.default

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
  m.entries.unshift [terms, f]

Method = {create, define, lookup}
export {Method}
