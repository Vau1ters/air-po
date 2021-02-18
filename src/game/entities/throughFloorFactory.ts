import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { ColliderComponent, Collider, ColliderBuilder } from '@game/components/colliderComponent'
import { Vec2 } from '@core/math/vec2'
import { CategoryList } from './category'
import throughFloorDefinition from '@res/animation/throughFloor.json'
import { StaticComponent } from '@game/components/staticComponent'
import { parseAnimation } from '@core/graphics/animationParser'

export class ThroughFloorFactory extends EntityFactory {
  readonly INV_MASS = 0
  readonly RESTITUTION = 0
  readonly WIDTH = 8
  readonly HEIGHT = 4
  readonly OFFSET_X = -this.WIDTH / 2
  readonly OFFSET_Y = -this.HEIGHT

  public create(): Entity {
    const entity = new Entity()

    const collider = new ColliderComponent()
    collider.colliders.push(
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB({
          offset: new Vec2(this.OFFSET_X, this.OFFSET_Y),
          size: new Vec2(this.WIDTH, this.HEIGHT),
        })
        .setCategory(CategoryList.wall)
        .addTag('throughFloor')
        .setShouldCollide((_: Collider, other: Collider): boolean => {
          if (!other.entity.hasComponent('RigidBody')) return false
          return other.entity.getComponent('RigidBody').velocity.y >= 0
        })
        .build()
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
