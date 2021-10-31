import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { ItemName } from '@game/flow/inventory/item'

export class PlayerComponent {
  public landing = false
  public possessingEntity: Entity | undefined = undefined
  public throughFloorIgnoreCount = 0
  public targetPosition = new Vec2()
  public spawnerID = 0
  public hasShot = false // for Weapon Background UI
  public coinCount = {
    small: 0,
    large: 0,
  }
  public itemList: Array<ItemName> = ['testItem', 'testItem', 'hpHealItem', 'airHealItem']
  constructor(public ui: Entity) {}

  public popItem(index: number): ItemName {
    const [item] = this.itemList.splice(index, 1)
    return item
  }
}
