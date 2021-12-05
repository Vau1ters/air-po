import * as t from 'io-ts'

const IntPropertyType = t.type({
  name: t.string,
  type: t.literal('int'),
  value: t.number,
})

const FloatPropertyType = t.type({
  name: t.string,
  type: t.literal('float'),
  value: t.number,
})

const StringPropertyType = t.type({
  name: t.string,
  type: t.literal('string'),
  value: t.string,
})

export const CustomPropertyType = t.union([IntPropertyType, FloatPropertyType, StringPropertyType])
export type CustomProperty = t.TypeOf<typeof CustomPropertyType>

interface TypeMap {
  int: number
  float: number
  string: string
}
export type CustomPropertyTypeName = keyof TypeMap
export type CustomPropertyValue<T extends CustomPropertyTypeName> = TypeMap[T]

interface PropertyOwner {
  properties?: Array<CustomProperty>
}

export function findCustomProperty<T extends CustomPropertyTypeName>(
  owner: PropertyOwner,
  type: T,
  propertyName: string
): CustomPropertyValue<T> | undefined {
  const prop = owner.properties?.find(property => property.name === propertyName)
  if (prop?.type !== type) return undefined
  return prop.value as TypeMap[T]
}
