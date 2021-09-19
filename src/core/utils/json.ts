import { assert } from './assertion'
import * as t from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'

export const decodeJson = <T extends object>(
  obj: object,
  baseType: { decode: (obj: object) => t.Validation<T> }
): T => {
  const decodeResult = baseType.decode(obj)
  assert(decodeResult._tag === 'Right', PathReporter.report(decodeResult).join('\n'))
  return obj as T
}
