import { EntityFactory } from './entityFactory'
import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import { Category, CategorySet } from './category'
import { AIComponent } from '@game/components/aiComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import { PickupTargetComponent } from '@game/components/pickupTargetComponent'
import dandelionFluffDefinition from '@res/animation/dandelion_fluff.json'
import { World } from '@core/ecs/world'
import { dandelionFluffAI } from '@game/ai/entity/dandelion/dandelionFluffAI'
import { ColliderComponent, buildCollider } from '@game/components/colliderComponent'

export class DandelionFluffFactory extends EntityFactory {
  private readonly COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(-8, -16),
    size: new Vec2(16, 32),
  }

  constructor(private world: World, private parent: Entity) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    const sprite = parseAnimation(dandelionFluffDefinition.sprite)
    const draw = new DrawComponent(entity)
    draw.addChild(sprite)

    entity.addComponent('AI', new AIComponent(dandelionFluffAI(entity, this.world)))
    entity.addComponent(
      'Position',
      new PositionComponent().add(this.parent.getComponent('Position'))
    )
    entity.addComponent(
      'Collider',
      new ColliderComponent(
        buildCollider({
          entity,
          geometry: this.COLLIDER,
          category: Category.ITEM,
          mask: new CategorySet(Category.SENSOR),
          tag: ['fluff'],
          isSensor: true,
        })
      )
    )
    entity.addComponent('Draw', draw)
    entity.addComponent('PickupTarget', new PickupTargetComponent(false))
    entity.addComponent('AnimationState', new AnimationStateComponent(sprite))
    return entity
  }
}
