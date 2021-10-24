import { assert } from '@utils/assertion'
import { itemURL } from 'tool/resourceURL/template/itemURL'

export type ItemName = keyof typeof itemURL

export const toItemName = (s: string): ItemName => {
  assert(s in itemURL, `'${s} is not ItemName`)
  return s as ItemName
}
