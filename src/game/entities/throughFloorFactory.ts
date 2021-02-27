import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { ColliderComponent, Collider, buildCollider } from '@game/components/colliderComponent'
import { Vec2 } from '@core/math/vec2'
import { Category, CategorySet } from './category'
import throughFloorDefinition from '@res/animation/throughFloor.json'
import { parseAnimation } from '@core/graphics/animationParser'
import { StaticComponent } from '@game/components/staticComponent'

export class ThroughFloorFactory extends EntityFactory {
  private readonly INV_MASS = 0
  private readonly RESTITUTION = 0

  private readonly COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(-4, -4),
    size: new Vec2(8, 4),
  }

  public create(): Entity {
    const entity = new Entity()

    const collider = new ColliderComponent()
    collider.colliders.push(
      buildCollider({
        entity,
        geometry: this.COLLIDER,
        category: Category.STATIC_WALL,
        mask: new CategorySet(Category.SENSOR, Category.PHYSICS),
        tag: ['throughFloor'],
        condition: (_: Collider, other: Collider): boolean => {
          if (!other.entity.hasComponent('RigidBody')) return false
          return other.entity.getComponent('RigidBody').velocity.y >= 0
        },
      })
    )

    const body = new RigidBodyComponent(0, new Vec2(), new Vec2(), this.RESTITUTION, 0)
    body.invMass = this.INV_MASS

    const sprite = parseAnimation(throughFloorDefinition.sprite)
    const draw = new DrawComponent(entity)
    draw.addChild(sprite)

    entity.addComponent('Static', new StaticComponent())
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('RigidBody', body)

    return entity
  }
}
