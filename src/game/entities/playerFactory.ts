import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { playerAI } from '@game/ai/entity/player/playerAI'
import { AiComponent } from '@game/components/aiComponent'
import { Collider } from '@game/components/colliderComponent'
import { EquipmentComponent } from '@game/components/equipmentComponent'
import { HpComponent } from '@game/components/hpComponent'
import { InvincibleComponent } from '@game/components/invincibleComponent'
import { NameComponent } from '@game/components/nameComponent'
import { PlayerComponent } from '@game/components/playerComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { PlayerData } from '@game/playdata/playdata'
import { EntityFactory } from './entityFactory'
import { HudFactory } from './hudFactory'
import { loadEntity } from './loader/EntityLoader'
import { THROUGH_FLOOR_TAG } from './stage/tile/throughFloorFactory'

export const PLAYER_SENSOR_TAG = 'PlayerSensor'
export const PLAYER_FOOT_TAG = 'PlayerFoot'

export class PlayerFactory extends EntityFactory {
  constructor(private world: World, private playerData: PlayerData) {
    super()
  }

  public create(): Entity {
    const entity = loadEntity('player')

    entity.addComponent('Position', new PositionComponent())
    entity.addComponent('Hp', new HpComponent(this.playerData.hp, this.playerData.maxHp, false))

    const player = new PlayerComponent(entity, new HudFactory(this.world).create())

    const equipment = new EquipmentComponent()
    equipment.equipEvent.addObserver(type => {
      if (type === 'AirTank') {
        const airHolder = entity.getComponent('AirHolder')
        equipment.airTank.count += 1
        airHolder.maxQuantity += equipment.airTank.quantity
        airHolder.quantity += equipment.airTank.quantity
      }
    })
    // 初期状態で空気タンクを2つ追加しておく
    equipment.equipEvent.notify('AirTank')
    equipment.equipEvent.notify('AirTank')

    const airHolder = entity.getComponent('AirHolder')
    airHolder.quantity = Math.min(this.playerData.air, airHolder.maxQuantity)

    entity.addComponent(
      'Ai',
      new AiComponent({
        behaviour: playerAI(entity, this.world),
        name: 'Player:AI',
        dependency: {
          before: ['ControlSystem:update'],
        },
      })
    )
    entity.addComponent('Invincible', new InvincibleComponent())
    entity.addComponent('Player', player)
    entity.addComponent('Equipment', equipment)
    entity.addComponent('Name', new NameComponent('player'))

    const colliders = entity.getComponent('Collider').colliders.filter(c => c.mask.has('terrain'))
    for (const c of colliders) {
      c.condition = (me: Collider, other: Collider): boolean => {
        if (player.throughFloorIgnoreCount > 0 && other.tag.has(THROUGH_FLOOR_TAG)) return false
        return true
      }
    }

    return entity
  }
}
