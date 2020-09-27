import { EntityFactory } from './entityFactory'
import { Entity } from '../ecs/entity'
import { PositionComponent } from '../components/positionComponent'
import { Vec2 } from '../math/vec2'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { CategorySet, Category } from './category'
import { AIComponent } from '../components/aiComponent'
import { parseSprite } from '../parser/spriteParser'
import { AnimationStateComponent } from '../components/animationStateComponent'
import { PickupTargetComponent } from '../components/pickupTargetComponent'
import dandelionFluffDefinition from '../../../res/entities/dandelion_fluff.json'
import { World } from '../ecs/world'
import { dandelionFluffAI } from '../ai/dandelionFluffAI'

export class DandelionFluffFactory extends EntityFactory {
  constructor(private world: World, private parent: Entity) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(0, 0).add(this.parent.getComponent('Position'))
    const draw = new DrawComponent()
    const collider = new ColliderComponent(entity)
    const pickup = new PickupTargetComponent(false)

    const aabb = new AABBDef(new Vec2(16, 32))
    aabb.offset.x = -8
    aabb.offset.y = -16
    aabb.tag.add('fluff')
    aabb.category = Category.DEFAULT
    aabb.mask = new CategorySet(Category.PLAYER)
    aabb.isSensor = true
    collider.createCollider(aabb)

    const sprite = parseSprite(dandelionFluffDefinition.sprite)
    draw.addChild(sprite)

    const animState = new AnimationStateComponent()
    animState.changeState.addObserver(x => sprite.changeTo(x))

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
