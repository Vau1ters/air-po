import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import mossDefinition from '@res/animation/moss.json'
import { World } from '@core/ecs/world'
import { ColliderBuilder, ColliderComponent } from '@game/components/colliderComponent'
import { CategoryList } from './category'
import { Vec2 } from '@core/math/vec2'
import { LightComponent } from '@game/components/lightComponent'

export class MossFactory extends EntityFactory {
  private readonly AABB = {
    offset: new Vec2(-4, -4),
    size: new Vec2(8, 8),
  }

  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(200, 100)
    const collider = new ColliderComponent()

    collider.colliders.push(
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.AABB)
        .setCategory(CategoryList.moss.light)
        .addTag('light')
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.AABB)
        .setCategory(CategoryList.moss.airSensor)
        .build()
    )

    const sprite = parseAnimation(mossDefinition.sprite)
    const draw = new DrawComponent(entity)
    draw.addChild(sprite)

    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('Light', new LightComponent(0))
    return entity
  }
}
