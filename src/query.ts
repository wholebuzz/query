import { compileExpression } from 'filtrex'

export const split = require('string-split-by')

export interface ParseFilterQueryOptions {
  debug?: boolean
  dontSearchOnlyFilter?: boolean
  searchTermCallback?: (term: string, fields: string[]) => void
  filterTermCallback?: (term: string) => void
}

/**
 * Creates regex-expanded Filtrex object-filter described by query.
 * @param query The query describing the filter.
 * @param objectFields The object fields to make accessible to the query.
 * @optional defaultFields The default fields to text search for non-property-query-terms.
 * @optional extraFunctions Map of extra functions to make available to query, e.g. startsWith().
 * @optional customProps Custom properties to make available to query, e.g. .authors.
 * @optional options Extra query options.
 */
export function parseFilterQuery<X>(
  query: string,
  objectFields: Set<string>,
  defaultFields: string[] = [],
  // tslint:disable-next-line
  extraFunctions: { [T: string]: Function } = {},
  customProps: { [T: string]: (x: X) => any } = {},
  options?: ParseFilterQueryOptions
): (x: X) => boolean {
  // Tokenize keeping function calls and quoted strings as one "word".
  const initial = split(query, ' ', { ignore: ['"', '()'], escape: true })
  const words: string[] = []
  for (let i = 0; i < initial.length; i++) {
    let updated = true
    let w = initial[i]
    while (w && updated) {
      updated = false
      for (let gram = 2; gram >= 1; gram--) {
        const ngram = w.substring(0, gram)
        if (ngram.length === gram && queryPunct.has(ngram)) {
          w = w.substring(gram)
          words.push(ngram)
          // If we grouped non-function parentheses, split the enclosed tokens.
          if (ngram === '(') {
            const remaining = split(w, ' ', { ignore: ['"', '()'], escape: true })
            if (remaining.length > 1) {
              w = remaining[0]
              initial.splice(i, 1, ...remaining)
            }
          }
          updated = true
          break
        }
      }
    }
    if (w) words.push(w)
  }
  // if (options?.debug) console.log('parseQuery expanded', query, words)

  // Expand query language replacing search terms with placeholder tokens indexing regex table.
  const regexes: Record<string, { fields: string[]; regex: RegExp; negated: boolean }> = {}
  const now = Date.now()
  let operatorLast = false
  let ind = 0
  let out = ''
  for (let w of words) {
    if (!w) continue
    switch (w) {
      case '!':
        w = 'not'
        break
      case '&&':
        w = 'and'
        break
      case '||':
        w = 'or'
        break
    }
    if (out.length > 0) out += ' '
    let isSearchTerm = false
    const isOperator = filtrexQueryOperators.has(w)
    if (!isOperator) {
      if (!operatorLast && out.length > 0) out += 'and '
      const isFunction = w.indexOf('(') >= 0
      const isDereference = w[0] === '.'
      const isProperty = objectFields.has(w) || isDereference
      if (!isFunction && !isProperty && !operatorLast) {
        const colon = w.indexOf(':')
        const negated = w[0] === '-'
        const fields = colon >= 0 ? [w.substring(negated ? 1 : 0, colon)] : defaultFields
        let phrase = colon >= 0 ? w.substring(colon + 1) : w
        if (phrase[0] === '"' && phrase[phrase.length - 1] === '"') {
          phrase = phrase.substring(1, phrase.length - 1)
          w = `w${++ind}`
        } else if (colon >= 0) {
          w = `w${++ind}`
        }
        if (!options?.dontSearchOnlyFilter) {
          const rq = '(^|\\b)' + phrase.split(' ').join('\\W+') + '(\\b|$)'
          regexes[w] = { fields, regex: new RegExp(rq, 'i'), negated }
        }
        isSearchTerm = true
        options?.searchTermCallback?.(phrase, fields)
      } else if (isDereference) {
        w = w.substring(1)
      }
    }
    if (!isSearchTerm) options?.filterTermCallback?.(w)
    if (!(isSearchTerm && options?.dontSearchOnlyFilter)) out += w
    operatorLast = isOperator
  }
  // if (options?.debug) console.log('parseQuery mapped', query, ' -> ', out, regexes)

  extraFunctions.now = () => now
  extraFunctions.endsWith = (haystack: string, needle: string) =>
    haystack && haystack.endsWith(needle)
  extraFunctions.startsWith = (haystack: string, needle: string) =>
    haystack && haystack.startsWith(needle)
  extraFunctions.select = extraFunctions.startsWith
  extraFunctions.remove = (haystack: string, needle: string) =>
    !(haystack && haystack.startsWith(needle))

  // Compile expanded Filtrex query.
  return compileExpression(out, {
    extraFunctions,
    customProp: (word: string, _: (name: string) => any, value: Record<string, any>) => {
      if (value.props?.hasOwnProperty(word)) return value.props[word]
      if (value.tags?.hasOwnProperty(word)) return value.tags[word]
      if (objectFields.has(word)) return value[word]
      if (customProps[word]) return customProps[word](value as X)
      const regex = regexes[word]
      if (regex) {
        for (const field of regex.fields) {
          const haystack = value.props?.[field] || value.tags?.[field] || value[field]
          if (haystack && (haystack.search(regex.regex) === -1) === regex.negated) return true
        }
      }
      return false
    },
  })
}

const queryPunct = new Set([
  '*',
  '/',
  '-',
  '+',
  '^',
  '%',
  '(',
  ')',
  ',',
  '==',
  '!=',
  '~=',
  '>=',
  '<=',
  '<',
  '>',
  '?',
  ':',
  '!',
  '&&',
  '||',
])

const filtrexQueryOperators = new Set([
  '*',
  '/',
  '-',
  '+',
  '^',
  '%',
  '(',
  ')',
  ',',
  '==',
  '!=',
  '~=',
  '>=',
  '<=',
  '<',
  '>',
  '?',
  ':',
  'and',
  'or',
  'not',
  'in',
  'of',
])
