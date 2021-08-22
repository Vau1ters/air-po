import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { assert } from '@utils/assertion'
import { Segment } from '@core/collision/geometry/segment'
import { Vec2 } from '@core/math/vec2'

export const BULLET_TAG = 'bulletBody'

export class BulletSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Bullet', 'Collider').build()
    this.family.entityAddedEvent.addObserver(entity => this.entityAdded(entity))
  }

  private entityAdded(entity: Entity): void {
    const collider = entity.getComponent('Collider')
    if (collider) {
      for (const c of collider.colliders) {
        if (c.tag.has(BULLET_TAG)) {
          assert(
            c.category === 'bullet',
            `Collider with '${BULLET_TAG}' tag must have BULLET category`
          )
          assert(c.mask.has('terrain'), `Collider with '${BULLET_TAG}' tag must have TERRAIN mask`)
          c.callbacks.add((args: CollisionCallbackArgs) => this.bulletCollisionCallback(args))
        }
      }
    }
  }

  public update(): void {
    for (const entity of this.family.entityIterator) {
      const bullet = entity.getComponent('Bullet')
      const collider = entity.getComponent('Collider')
      for (const c of collider.colliders) {
        const segment = c.geometry as Segment
        segment.start = new Vec2()
        segment.end = bullet.previousPos.sub(entity.getComponent('Position'))
      }
      bullet.previousPos = entity.getComponent('Position').copy()

      if (bullet.life-- < 0) {
        this.world.removeEntity(entity)
      }
    }
  }

  private bulletCollisionCallback(args: CollisionCallbackArgs): void {
    const {
      me: { entity: bullet },
    } = args
    this.world.removeEntity(bullet)
  }
}
