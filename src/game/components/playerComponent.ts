import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { ItemName } from '@game/flow/inventory/item'
import { instantiateItem } from '@game/item/instantiateItem'
import { Item } from '@game/item/item'
import {
  LargeCoinID,
  loadPlayData,
  PlayData,
  SaveDataVersion,
  StoryStatus,
} from '@game/playdata/playdata'
import { SpawnPoint } from './gameEventComponent'

export type InterMapPlayerInfo = {
  hp: number
  spawnPoint: SpawnPoint
  smallCoinCount: number
  acquiredLargeCoinList: Set<LargeCoinID>
  itemList: Array<ItemName>
}

export class PlayerComponent {
  public landing = false
  public possessingEntity: Entity | undefined = undefined
  public throughFloorIgnoreCount = 0
  public targetPosition = new Vec2()
  public hasShot = false // for Weapon Background UI
  public smallCoinCount: number
  public acquiredLargeCoinList: Set<LargeCoinID>
  public itemList: Array<Item>

  constructor(player: Entity, public ui: Entity) {
    const playData = loadPlayData()

    this.smallCoinCount = playData.smallCoinCount
    this.acquiredLargeCoinList = new Set(playData.acquiredLargeCoinList)
    this.itemList = []
    for (const item of playData.itemList) {
      this.itemList.push(instantiateItem(item, player))
    }
  }

  public popItem(index: number): Item {
    const [item] = this.itemList.splice(index, 1)
    return item
  }

  public toPlayData(storyStatus: StoryStatus, spawnPoint: SpawnPoint): PlayData {
    return {
      version: SaveDataVersion,
      storyStatus,
      spawnPoint,
      itemList: this.itemList.map(item => item.name),
      smallCoinCount: this.smallCoinCount,
      acquiredLargeCoinList: Array.from(this.acquiredLargeCoinList),
      equipmentList: [],
    }
  }
}
