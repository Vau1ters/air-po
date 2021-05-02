import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import {
  ColliderComponent,
  buildColliders,
  CollisionCallbackArgs,
} from '@game/components/colliderComponent'
import { MapBuilder } from '@game/map/mapBuilder'
import { Category, CategorySet } from '../category'
import { TileEntityFactory } from './tileEntityFactory'
import { createHash } from 'crypto'

export class RespawnFlagFactory extends TileEntityFactory {
  private readonly COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(48, 48),
  }

  constructor(pos: Vec2, name: string, frame: number, world: World, private builder: MapBuilder) {
    super(pos, name, frame, world)
  }

  public create(): Entity {
    const entity = super.create()

    const hash = createHash('md5')
    hash.update(entity.getComponent('Position').x.toString())
    hash.update(entity.getComponent('Position').y.toString())

    const spawnerID = parseInt('0x' + hash.digest('hex'), 16)
    this.builder.registerSpawner(spawnerID, entity.getComponent('Position'))

    entity.addComponent(
      'Collider',
      new ColliderComponent(
        ...buildColliders({
          entity,
          colliders: [
            {
              geometry: this.COLLIDER,
              category: Category.SENSOR,
              mask: new CategorySet(Category.PLAYER_HITBOX),
              callbacks: [
                (args: CollisionCallbackArgs): void => {
                  const {
                    other: { entity: player },
                  } = args
                  player.getComponent('Player').spawnerID = spawnerID
                },
              ],
            },
          ],
        })
      )
    )

    return entity
  }
}
