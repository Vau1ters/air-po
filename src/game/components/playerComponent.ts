import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { instantiateItem } from '@game/item/instantiateItem'
import { Item } from '@game/item/item'
import { LargeCoinID, loadData, PlayerData } from '@game/playdata/playdata'

export class PlayerComponent {
  public landing = false
  public possessingEntity: Entity | undefined = undefined
  public throughFloorIgnoreCount = 0
  public targetPosition = new Vec2()
  public hasShot = false // for Weapon Background UI
  public smallCoinCount: number
  public acquiredLargeCoinList: Set<LargeCoinID>
  public itemList: Array<Item>

  constructor(private player: Entity, public ui: Entity) {
    const { playerData } = loadData()

    this.smallCoinCount = playerData.smallCoinCount
    this.acquiredLargeCoinList = new Set(playerData.acquiredLargeCoinList)
    this.itemList = []
    for (const item of playerData.itemList) {
      this.itemList.push(instantiateItem(item, player))
    }
  }

  public popItem(index: number): Item {
    const [item] = this.itemList.splice(index, 1)
    return item
  }

  public get playerData(): PlayerData {
    const hp = this.player.getComponent('Hp')
    return {
      hp: hp.hp,
      maxHp: hp.maxHp,
      itemList: this.itemList.map(item => item.name),
      smallCoinCount: this.smallCoinCount,
      acquiredLargeCoinList: Array.from(this.acquiredLargeCoinList),
      equipmentList: [],
    }
  }
}
