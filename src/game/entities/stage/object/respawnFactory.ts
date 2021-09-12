import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { createHash } from 'crypto'
import { EntityName } from '@game/entities/loader/EntityLoader'
import { Stage } from '@game/stage/stage'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'
import { StageObject } from '@game/stage/object'

export default class RespawnFactory extends ObjectEntityFactory {
  constructor(
    name: EntityName,
    object: StageObject,
    frame: number,
    world: World,
    private stage: Stage
  ) {
    super(name, object, frame, world)
  }

  public create(): Entity {
    const entity = super.create()

    const hash = createHash('md5')
    hash.update(entity.getComponent('Position').x.toString())
    hash.update(entity.getComponent('Position').y.toString())

    const spawnerID = parseInt('0x' + hash.digest('hex'), 16)
    this.stage.registerSpawner(spawnerID, entity.getComponent('Position'))

    const [collider] = entity.getComponent('Collider').colliders
    collider.callbacks.add((args: CollisionCallbackArgs): void => {
      const {
        other: { entity: player },
      } = args
      player.getComponent('Player').spawnerID = spawnerID
    })

    return entity
  }
}
