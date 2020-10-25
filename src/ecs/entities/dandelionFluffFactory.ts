import { EntityFactory } from './entityFactory'
import { Entity } from '../entity'
import { PositionComponent } from '../components/positionComponent'
import { Vec2 } from '../../math/vec2'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { CategoryList } from './category'
import { AIComponent } from '../components/aiComponent'
import { parseSprite } from '../../graphics/spriteParser'
import { AnimationStateComponent } from '../components/animationStateComponent'
import { PickupTargetComponent } from '../components/pickupTargetComponent'
import dandelionFluffDefinition from '../../../res/entities/dandelion_fluff.json'
import { World } from '../world'
import { dandelionFluffAI } from '../../behaviour/entityAI/dandelion/dandelionFluffAI'

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

    const sprite = parseSprite(dandelionFluffDefinition.sprite)
    const draw = new DrawComponent(entity, sprite)

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
