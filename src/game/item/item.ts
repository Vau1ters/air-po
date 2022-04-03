import { Entity } from '@core/ecs/entity'
import { assert } from '@utils/assertion'
import { ItemSetting, itemURL } from './itemURL.autogen'

export type ItemName = keyof typeof itemURL

export const toItemName = (s: string): ItemName => {
  assert(s in itemURL, `'${s} is not ItemName`)
  return s as ItemName
}

export abstract class Item {
  constructor(public readonly name: ItemName, protected player: Entity) {}
  abstract use(): void
  abstract canUse(): boolean
  get setting(): ItemSetting {
    return itemURL[this.name]
  }
}
