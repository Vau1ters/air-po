import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { Equipment, EquipmentName } from '@game/equipment/equipment'
import { equipmentClass } from '@game/equipment/equipmentURL.autogen'
import { Item } from '@game/item/item'
import { itemClass } from '@game/item/itemURL.autogen'
import { LargeCoinID, PlayerData } from '@game/playdata/playdata'
import { assert } from '@utils/assertion'
import { EventNotifier } from '@utils/eventNotifier'

const WeaponTypes = ['Gun', 'AirNade'] as const
export type WeaponType = typeof WeaponTypes[number]

export class PlayerComponent {
  public landing = false
  public possessingEntity: Entity | undefined = undefined
  public throughFloorIgnoreCount = 0
  public targetPosition = new Vec2()
  public hasShot = false // for Weapon Background UI
  public smallCoinCount: number
  public acquiredLargeCoinList: Set<LargeCoinID>
  public itemList: Array<Item>
  private _currentWeapon: WeaponType = 'Gun'
  public readonly weaponChanged: EventNotifier<number>
  public weaponChanging = false
  private equipmentList: Array<Equipment>

  constructor(private player: Entity, playerData: PlayerData, public ui: Entity) {
    this.smallCoinCount = playerData.smallCoinCount
    this.acquiredLargeCoinList = new Set(playerData.acquiredLargeCoinList)
    this.itemList = playerData.itemList.map(
      item => new itemClass[item as keyof typeof itemClass](item, player)
    )
    this.equipmentList = playerData.equipmentList.map(
      e => new equipmentClass[e as keyof typeof equipmentClass](e, player)
    )
    for (const e of this.equipmentList) {
      e.onEquip()
    }
    this.weaponChanged = new EventNotifier()
  }

  public addEquipment(e: Equipment): void {
    this.equipmentList.push(e)
    e.onEquip()
  }

  public popItem(index: number): Item {
    const [item] = this.itemList.splice(index, 1)
    return item
  }

  public getEquipmentCount(name: EquipmentName): number {
    return this.equipmentList.filter(e => e.name === name).length
  }

  public get playerData(): PlayerData {
    const airHolder = this.player.getComponent('AirHolder')
    const hp = this.player.getComponent('Hp')
    return {
      hp: hp.hp,
      maxHp: hp.maxHp,
      air: airHolder.quantity,
      itemList: this.itemList.map(item => item.name),
      smallCoinCount: this.smallCoinCount,
      acquiredLargeCoinList: Array.from(this.acquiredLargeCoinList),
      equipmentList: Array.from(this.equipmentList.map(e => e.name)),
    }
  }

  get currentWeapon(): WeaponType {
    return this._currentWeapon
  }

  changeWeapon(delta: number): void {
    if (this.weaponChanging) return
    const currentIndex = this.weaponToIndex(this.currentWeapon)
    const nextIndex = (currentIndex + delta + 2) % 2
    this._currentWeapon = this.indexToWeapon(nextIndex)
    this.weaponChanged.notify(delta)
    this.weaponChanging = true
  }

  private indexToWeapon(index: number): WeaponType {
    const type = WeaponTypes[index]
    assert(type !== undefined, `invalid index ${index}`)
    return type
  }

  private weaponToIndex(type: WeaponType): number {
    const index = WeaponTypes.indexOf(type)
    assert(index !== -1, `invalid type ${type}`)
    return index
  }
}
