import { compileExpression } from 'filtrex'
import { parseFilterQuery } from './query'
import * as assert from 'assert'

interface TypedValue {
  type: string
  value: string
  name?: string
  props?: Record<string, any>
}

const edges = [
  { type: 'category', value: 'foo', props: { mixin: 'true' } },
  { type: 'category', value: 'bar' },
  { type: 'user', value: 'super' },
  { type: 'author', value: 'coffee' },
  { type: 'guid', value: '""""((((&20?dsj%3298$3\'8 27' },
  { type: 'guid', value: '""""((((&20?dsj%3298$3\'8 \t\n 27' },
  { type: 'feed', value: 'www.feed/rss', props: { mixin: 'false' } },
]

it('Should filter objects correctly', async () => {
  const targetFields = new Set(['type', 'value', 'props'])

  const filter1 = parseFilterQuery<TypedValue>(
    'mixin == "true" || (type != "category" && type != "search" && type != "user")',
    targetFields,
    [],
    {},
    {},
    { debug: true }
  )
  assert.equal(filter1(edges[0]), true)
  assert.equal(filter1(edges[1]), false)
  assert.equal(filter1(edges[2]), false)
  assert.equal(filter1(edges[3]), true)
  assert.equal(filter1(edges[4]), true)
  assert.equal(filter1(edges[5]), true)

  const filter2 = parseFilterQuery<TypedValue>(
    'mixin != "true" && (type == "category" || type == "search")',
    targetFields
  )
  assert.equal(filter2(edges[0]), false)
  assert.equal(filter2(edges[1]), true)
  assert.equal(filter2(edges[2]), false)
  assert.equal(filter2(edges[3]), false)
  assert.equal(filter2(edges[4]), false)
  assert.equal(filter2(edges[5]), false)

  const filter3 = parseFilterQuery<TypedValue>('type == "user" && value == "super"', targetFields)
  assert.equal(filter3(edges[0]), false)
  assert.equal(filter3(edges[1]), false)
  assert.equal(filter3(edges[2]), true)
  assert.equal(filter3(edges[3]), false)
  assert.equal(filter3(edges[4]), false)
  assert.equal(filter3(edges[5]), false)

  const filter4 = parseFilterQuery<TypedValue>('type == "category"', targetFields)
  assert.equal(filter4(edges[0]), true)
  assert.equal(filter4(edges[1]), true)
  assert.equal(filter4(edges[2]), false)
  assert.equal(filter4(edges[3]), false)
  assert.equal(filter4(edges[4]), false)
  assert.equal(filter4(edges[5]), false)

  const filter5 = parseFilterQuery<TypedValue>(
    `type == "guid" and value == ${JSON.stringify(edges[4].value)}`,
    targetFields
  )
  assert.equal(filter5(edges[0]), false)
  assert.equal(filter5(edges[1]), false)
  assert.equal(filter5(edges[2]), false)
  assert.equal(filter5(edges[3]), false)
  assert.equal(filter5(edges[4]), true)
  assert.equal(filter5(edges[5]), false)

  let fail = false
  try {
    const filter6 = compileExpression(
      `type == "guid" and value == ${JSON.stringify(edges[5].value)}`
    )
    assert.equal(filter6(edges[5]), true)
  } catch (err) {
    fail = true
  }
  assert.equal(fail, true)
})

