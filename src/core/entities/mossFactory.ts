import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { DrawComponent } from '../components/drawComponent'
import { parseSprite } from '../parser/spriteParser'
import mossDefinition from '../../../res/entities/moss.json'
import { World } from '../ecs/world'
import { AABBDef, ColliderComponent } from '../components/colliderComponent'
import { Category, CategorySet } from './category'
import { Vec2 } from '../math/vec2'
import { LightComponent } from '../components/lightComponent'

export class MossFactory extends EntityFactory {
  readonly WIDTH = 8
  readonly HEIGHT = 8

  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(200, 100)
    const draw = new DrawComponent()
    const collider = new ColliderComponent(entity)

    const aabbBody = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    aabbBody.tag.add('light')
    aabbBody.category = Category.LIGHT
    aabbBody.mask = new CategorySet(Category.SEARCH, Category.AIR)
    collider.createCollider(aabbBody)

    const sprite = parseSprite(mossDefinition.sprite)

    draw.addChild(sprite)

    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('Light', new LightComponent(0))
    return entity
  }
}
