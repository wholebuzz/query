[@wholebuzz/archive-client](../README.md) / [Exports](../modules.md) / ParseFilterQueryOptions

# Interface: ParseFilterQueryOptions

## Table of contents

### Properties

- [debug](parsefilterqueryoptions.md#debug)
- [dontSearchOnlyFilter](parsefilterqueryoptions.md#dontsearchonlyfilter)
- [filterTermCallback](parsefilterqueryoptions.md#filtertermcallback)
- [searchTermCallback](parsefilterqueryoptions.md#searchtermcallback)

## Properties

### debug

• `Optional` **debug**: *boolean*

Defined in: query.ts:6

___

### dontSearchOnlyFilter

• `Optional` **dontSearchOnlyFilter**: *boolean*

Defined in: query.ts:7

___

### filterTermCallback

• `Optional` **filterTermCallback**: (`term`: *string*) => *void*

#### Type declaration

▸ (`term`: *string*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `term` | *string* |

**Returns:** *void*

Defined in: query.ts:9

___

### searchTermCallback

• `Optional` **searchTermCallback**: (`term`: *string*, `fields`: *string*[]) => *void*

#### Type declaration

▸ (`term`: *string*, `fields`: *string*[]): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `term` | *string* |
| `fields` | *string*[] |

**Returns:** *void*

Defined in: query.ts:8
