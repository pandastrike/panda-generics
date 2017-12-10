"use strict";

(function () {
  var Method,
      create,
      define,
      dispatch,
      lookup,
      slice = [].slice;

  lookup = function (m, ax) {
    var f, i, j, len, match, ref, term, terms;
    ref = m.entries;
    // go through each definition in our lookup 'table'
    for (j = 0, len = ref.length; j < len; j++) {
      [terms, f] = ref[j];
      if (terms.length > ax.length) {
        // there must be at least one argument per term
        // (variadic terms can consume multiple arguments,
        // so the converse is not true)
        continue;
      }
      // we can't have a match if we don't match any terms
      match = false;
      // each argument must be consumed
      i = 0;
      while (i < ax.length) {
        if ((term = terms[i]) == null) {
          match = false;
          break;
        }
        // if the term may be variadic (indicated by taking 0 arguments)
        // try the term with the remaining arguments
        if (term.length === 0) {
          match = term(...ax.slice(i));
          break;
        }
        if (!(match = term(ax[i++]))) {
          // otherwise, we have the default case, where we try to match
          // the next argument with the next term
          break;
        }
      }
      if (match) {
        // if we ended up with a match, just return the corresponding fn
        return f;
      }
    }
    // if exit the loop without returning a match, return the default
    return m.default;
  };

  dispatch = function (method, ax) {
    var f;
    f = lookup(method, ax);
    return f(...ax);
  };

  create = function (options) {
    var k, m, v;
    m = function (...args) {
      return dispatch(m, args);
    };
    m.entries = [];
    for (k in options) {
      v = options[k];
      m[k] = v;
    }
    if (m.default == null) {
      m.default = function () {
        throw new TypeError("No method matches arguments.");
      };
    }
    return m;
  };

  define = function (m, ...terms) {
    var f, j, ref;
    ref = terms, terms = 2 <= ref.length ? slice.call(ref, 0, j = ref.length - 1) : (j = 0, []), f = ref[j++];
    return m.entries.unshift([terms, f]);
  };

  Method = { create, define, lookup };

  module.exports = { Method };
}).call(undefined);