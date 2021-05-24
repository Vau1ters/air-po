import { EntityFactory } from './entityFactory'
import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import { Category } from './category'
import { AIComponent } from '@game/components/aiComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import { PickupTargetComponent } from '@game/components/pickupTargetComponent'
import dandelionFluffDefinition from '@res/setting/dandelionFluff.json'
import { World } from '@core/ecs/world'
import { dandelionFluffAI } from '@game/ai/entity/dandelion/dandelionFluffAI'
import { ColliderComponent, buildCollider } from '@game/components/colliderComponent'
import { FLUFF_TAG } from '@game/ai/entity/player/playerItemAction'

const EMIT_POS_DIFF = new Vec2(0, 16)

export class DandelionFluffFactory extends EntityFactory {
  private readonly COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(16, 32),
  }

  constructor(private world: World, private parent: Entity) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    entity.addComponent('AI', new AIComponent(dandelionFluffAI(entity, this.world)))
    entity.addComponent(
      'Position',
      new PositionComponent().add(this.parent.getComponent('Position').add(EMIT_POS_DIFF))
    )
    entity.addComponent(
      'Collider',
      new ColliderComponent(
        buildCollider({
          entity,
          geometry: this.COLLIDER,
          category: Category.ITEM,
          tag: [FLUFF_TAG],
        })
      )
    )
    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: parseAnimation(dandelionFluffDefinition),
        },
      })
    )
    entity.addComponent('PickupTarget', new PickupTargetComponent(false))
    entity.addComponent('AnimationState', new AnimationStateComponent(entity))
    entity.getComponent('Draw').zIndex = -100
    return entity
  }
}
