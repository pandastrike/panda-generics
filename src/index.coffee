class GenericFunction

  @create: (options = {}) -> new @ options

  constructor: ({@name, @description, @default}) ->
    @name ?= "anonymous-generic"
    @entries = []
    @default ?= (args...) =>
      error = new TypeError "#{@name}: Invalid arguments."
      error.arguments = args
      throw error

  define: (terms..., f) -> @entries.unshift [terms, f]

  lookup: (args) ->

    # go through each definition in our lookup 'table'
    for [terms, f] in @entries

      # there must be at least one argument per term
      # (variadic terms can consume multiple arguments,
      # so the converse is not true)
      continue if terms.length > args.length

      # we can't have a match if we don't match any terms
      match = false

      # each argument must be consumed
      i = 0
      while i < args.length

        # if there's no corresponding term, we have leftover
        # arguments with no term to consume them, so move on
        if !(term = terms[i])?
          match = false
          break

        # if the term may be variadic (indicated by taking 0 arguments)
        # try the term with the remaining arguments
        if term.length == 0
          match = term args[i..]...
          break

        # otherwise, we have the default case, where we try to match
        # the next argument with the next term
        break if !(match = term args[i++])

      # if we ended up with a match, just return the corresponding fn
      return f if match

    # if exit the loop without returning a match, return the default
    @default

  dispatch: (args) ->
    f = @lookup args
    f args...

lookup = ({_}, args) -> _.lookup args
define = ({_}, args...) -> _.define args...
create = (options) ->
  generic = (args...) -> generic._.dispatch args
  generic._ = GenericFunction.create options
  generic

export default {create, define, lookup}
