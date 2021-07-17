import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { MapBuilder } from '@game/map/mapBuilder'
import { TileEntityFactory } from './tileEntityFactory'
import { createHash } from 'crypto'
import { EntityName } from '../loader/EntityLoader'

export class RespawnFlagFactory extends TileEntityFactory {
  constructor(
    pos: Vec2,
    name: EntityName,
    frame: number,
    world: World,
    private builder: MapBuilder
  ) {
    super(pos, name, frame, world)
  }

  public create(): Entity {
    const entity = super.create()

    const hash = createHash('md5')
    hash.update(entity.getComponent('Position').x.toString())
    hash.update(entity.getComponent('Position').y.toString())

    const spawnerID = parseInt('0x' + hash.digest('hex'), 16)
    this.builder.registerSpawner(spawnerID, entity.getComponent('Position'))

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
