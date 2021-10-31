import { Entity } from '@core/ecs/entity'
import { ItemName } from '@game/flow/inventory/item'
import { AirHealItem } from './airHealItem'
import { HpHealItem } from './hpHealItem'
import { Item } from './item'
import { TestItem } from './testItem'

export const instantiateItem = (itemName: ItemName, player: Entity): Item => {
  const ctors = { testItem: TestItem, hpHealItem: HpHealItem, airHealItem: AirHealItem }
  return new ctors[itemName as keyof typeof ctors](itemName, player)
}
