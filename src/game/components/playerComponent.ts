import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { instantiateItem } from '@game/item/instantiateItem'
import { Item } from '@game/item/item'

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
  public itemList: Array<Item> = []

  constructor(player: Entity, public ui: Entity) {
    this.itemList.push(instantiateItem('testItem', player))
    this.itemList.push(instantiateItem('testItem', player))
    this.itemList.push(instantiateItem('hpHealItem', player))
    this.itemList.push(instantiateItem('airHealItem', player))
  }

  public popItem(index: number): Item {
    const [item] = this.itemList.splice(index, 1)
    return item
  }
}
