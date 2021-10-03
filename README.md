# @wholebuzz/query

Regex extended [filtrex](https://github.com/m93a/filtrex#readme) object query language.

## Example

```
import { parseFilterQuery } from '@wholebuzz/query/lib/query'

interface Record {
  title: string
  count: number
}
const records: Record[] = [
  { title: 'Blues guitar volume 1', count: 35 },
  { title: 'Rock guitar volume 3', count: 46 },
  { title: 'Blues harmonica volume 1', count: 10 },
]
const parseRecordQuery = (q: string) =>
  parseFilterQuery<Record>(q, new Set(['title', 'count']), ['title'])

// [
//   { title: 'Blues guitar volume 1', count: 35 },
//   { title: 'Blues harmonica volume 1', count: 10 }
// ]
console.log(records.filter(parseRecordQuery('blues')))

//[ { title: 'Blues guitar volume 1', count: 35 } ]
console.log(records.filter(parseRecordQuery('blues count>10')))

// [
//   { title: 'Blues guitar volume 1', count: 35 },
//   { title: 'Rock guitar volume 3', count: 46 }
// ]
console.log(records.filter(parseRecordQuery('count>=35')))

// [ { title: 'Rock guitar volume 3', count: 46 } ]
console.log(records.filter(parseRecordQuery('rock')))
```

## Table of contents

### Interfaces

- [ParseFilterQueryOptions](docs/interfaces/parsefilterqueryoptions.md)

### Variables

- [split](docs/modules.md#split)

### Functions

- [parseFilterQuery](docs/modules.md#parsefilterquery)

## Variables

### split

• `Const` **split**: *any*

Defined in: query.ts:3

## Functions

### parseFilterQuery

▸ **parseFilterQuery**<X\>(docs/`query`: *string*, `objectFields`: *Set*<string\>, `defaultFields?`: *string*[], `extraFunctions?`: { [T: string]: Function;  }, `customProps?`: { [T: string]: (`x`: X) => *any*;  }, `options?`: [*ParseFilterQueryOptions*](interfaces/parsefilterqueryoptions.md)): *function*

Creates regex-expanded Filtrex object-filter described by query.

**`optional`** defaultFields The default fields to text search for non-property-query-terms.

**`optional`** extraFunctions Map of extra functions to make available to query, e.g. startsWith(docs/).

**`optional`** customProps Custom properties to make available to query, e.g. .authors.

**`optional`** options Extra query options.

#### Type parameters

| Name |
| :------ |
| `X` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `query` | *string* | - | The query describing the filter. |
| `objectFields` | *Set*<string\> | - | The object fields to make accessible to the query. |
| `defaultFields` | *string*[] | [] | - |
| `extraFunctions` | *object* | {} | - |
| `customProps` | *object* | {} | - |
| `options?` | [*ParseFilterQueryOptions*](docs/interfaces/parsefilterqueryoptions.md) | - | - |

**Returns:** (docs/`x`: X) => *boolean*

Defined in: query.ts:21
