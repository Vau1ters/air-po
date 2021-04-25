import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import {
  ColliderComponent,
  buildColliders,
  CollisionCallbackArgs,
} from '@game/components/colliderComponent'
import { Category, CategorySet } from '../category'
import { TileEntityFactory } from './tileEntityFactory'

export class RespawnFlagFactory extends TileEntityFactory {
  private readonly COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(48, 48),
  }

  public create(): Entity {
    const entity = super.create()

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
                    me: { entity: respawnFlag },
                    other: { entity: player },
                  } = args
                  player.getComponent('Player').lastRespawnFlag = respawnFlag
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
