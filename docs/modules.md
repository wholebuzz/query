[@wholebuzz/archive-client](README.md) / Exports

# @wholebuzz/archive-client

## Table of contents

### Interfaces

- [ParseFilterQueryOptions](interfaces/parsefilterqueryoptions.md)

### Variables

- [split](modules.md#split)

### Functions

- [parseFilterQuery](modules.md#parsefilterquery)

## Variables

### split

• `Const` **split**: *any*

Defined in: query.ts:3

## Functions

### parseFilterQuery

▸ **parseFilterQuery**<X\>(`query`: *string*, `objectFields`: *Set*<string\>, `defaultFields?`: *string*[], `extraFunctions?`: { [T: string]: Function;  }, `customProps?`: { [T: string]: (`x`: X) => *any*;  }, `options?`: [*ParseFilterQueryOptions*](interfaces/parsefilterqueryoptions.md)): *function*

Creates regex-expanded Filtrex object-filter described by query.

**`optional`** defaultFields The default fields to text search for non-property-query-terms.

**`optional`** extraFunctions Map of extra functions to make available to query, e.g. startsWith().

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
| `options?` | [*ParseFilterQueryOptions*](interfaces/parsefilterqueryoptions.md) | - | - |

**Returns:** (`x`: X) => *boolean*

Defined in: query.ts:21
