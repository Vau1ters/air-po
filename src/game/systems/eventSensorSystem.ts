import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { System } from '@core/ecs/system'
import { World } from '@core/ecs/world'
import { EquipmentTypes } from '@game/components/equipmentComponent'
import * as Sound from '@core/sound/sound'
import { PLAYER_SENSOR_TAG } from '@game/entities/playerFactory'
import { StageName } from '@game/stage/stageLoader'
import { getSingleton } from './singletonSystem'
import { SpawnPoint } from '@game/components/gameEventComponent'

export class EventSensorSystem extends System {
  private sensorFamily: Family

  constructor(world: World) {
    super(world)
    this.sensorFamily = new FamilyBuilder(world).include('Sensor').build()
    this.sensorFamily.entityAddedEvent.addObserver((e: Entity) => this.onSensorAdded(e))
  }

  public update(): void {}

  private onSensorAdded(entity: Entity): void {
    const { event } = entity.getComponent('Sensor')
    for (const c of entity.getComponent('Collider').colliders) {
      c.callbacks.add(async (args: CollisionCallbackArgs) => {
        if (!args.other.tag.has(PLAYER_SENSOR_TAG)) return
        await this.fireEvent(event)
      })
    }
  }

  private async fireEvent(event: string): Promise<void> {
    const [eventName, ...options] = event.split(' ')
    switch (eventName) {
      case 'changeMap':
        await this.moveEvent({ stageName: options[0] as StageName, spawnerID: Number(options[1]) })
        break
      case 'equipItem':
        await this.equipItemEvent(options[0] as EquipmentTypes, Number(options[1]))
        break
    }
  }

  private async moveEvent(spawnPoint: SpawnPoint): Promise<void> {
    getSingleton('GameEvent', this.world).getComponent('GameEvent').event = {
      type: 'move',
      spawnPoint,
    }
  }

  private async equipItemEvent(equipmentType: EquipmentTypes, equipmentId: number): Promise<void> {
    const player = getSingleton('Player', this.world)
    const equipmentComponent = player.getComponent('Equipment')
    equipmentComponent.equipEvent.notify(equipmentType)
    Sound.play('getAirTank')
    this.world.removeEntityById(equipmentId)
  }
}
