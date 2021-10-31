import { Entity } from '@core/ecs/entity'
import { ItemName } from '@game/flow/inventory/item'
import { useAirHealItem } from './airHealItem'
import { useHpHealItem } from './hpHealItem'
import { useTestItem } from './testItem'

export const useItem = (item: ItemName, player: Entity): void => {
  switch (item) {
    case 'airHealItem':
      useAirHealItem(player)
      break
    case 'hpHealItem':
      useHpHealItem(player)
      break
    case 'testItem':
      useTestItem()
      break
  }
}
