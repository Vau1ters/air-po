import { Entity } from '@core/ecs/entity'
import { ItemName } from '@game/flow/inventory/item'
import { ItemSetting, itemURL } from '@game/flow/inventory/itemURL'

export abstract class Item {
  constructor(private name: ItemName, protected player: Entity) {}
  abstract use(): void
  abstract canUse(): boolean
  get setting(): ItemSetting {
    return itemURL[this.name]
  }
}
