import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { DrawComponent } from '../components/drawComponent'
import { AirHolderComponent } from '../components/airHolderComponent'
import { parseSprite } from '../parser/spriteParser'
import kokeDefinition from '../../../res/entities/koke.json'
import { World } from '../ecs/world'
import { AABBDef, ColliderComponent } from '../components/colliderComponent'
import { Category, CategorySet } from './category'
import { Vec2 } from '../math/vec2'
import { LightComponent } from '../components/lightComponent'

export class KokeFactory extends EntityFactory {
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
    const airHolder = new AirHolderComponent({
      initialQuantity: 0,
      maxQuantity: 1,
      collectSpeed: 0,
      consumeSpeed: 0,
    })

    const aabbBody = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    aabbBody.tag.add('light')
    aabbBody.category = Category.LIGHT
    aabbBody.mask = new CategorySet(Category.SEARCH, Category.AIR)
    collider.createCollider(aabbBody)

    const sprite = parseSprite(kokeDefinition.sprite)

    draw.addChild(sprite)

    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('AirHolder', airHolder)
    entity.addComponent('Light', new LightComponent(0))
    return entity
  }
}
