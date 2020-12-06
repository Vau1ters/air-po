import { EntityFactory } from './entityFactory'
import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import { ColliderComponent, AABBDef } from '@game/components/colliderComponent'
import { CategoryList } from './category'
import { AIComponent } from '@game/components/aiComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import { PickupTargetComponent } from '@game/components/pickupTargetComponent'
import dandelionFluffDefinition from '@res/animation/dandelion_fluff.json'
import { World } from '@core/ecs/world'
import { dandelionFluffAI } from '@game/ai/entity/dandelion/dandelionFluffAI'

export class DandelionFluffFactory extends EntityFactory {
  constructor(private world: World, private parent: Entity) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(0, 0).add(this.parent.getComponent('Position'))
    const collider = new ColliderComponent(entity)
    const pickup = new PickupTargetComponent(false)

    const aabb = new AABBDef(new Vec2(16, 32), CategoryList.dandelionFluff)
    aabb.tag.add('fluff')
    aabb.offset = new Vec2(-8, -16)
    aabb.isSensor = true
    collider.createCollider(aabb)

    const sprite = parseAnimation(dandelionFluffDefinition.sprite)
    const draw = new DrawComponent(entity)
    draw.addChild(sprite)

    const animState = new AnimationStateComponent(sprite)

    const ai = new AIComponent(dandelionFluffAI(entity, this.world))

    entity.addComponent('AI', ai)
    entity.addComponent('Position', position)
    entity.addComponent('Collider', collider)
    entity.addComponent('Draw', draw)
    entity.addComponent('PickupTarget', pickup)
    entity.addComponent('AnimationState', animState)
    return entity
  }
}
