import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { System } from '@core/ecs/system'
import { World } from '@core/ecs/world'
import { PLAYER_SENSOR_TAG } from '@game/entities/playerFactory'
import { StageName } from '@game/stage/stageLoader'
import { getSingleton } from './singletonSystem'
import { StagePoint } from '@game/components/stagePointComponent'

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
      case 'changeMap': {
        const stageName = options[0] as StageName
        const pointID = Number(options[1])
        await this.moveEvent({ stageName, pointID })
        break
      }
    }
  }

  private async moveEvent(spawnPoint: StagePoint): Promise<void> {
    getSingleton('GameEvent', this.world).getComponent('GameEvent').event = {
      type: 'move',
      spawnPoint,
    }
  }
}
