import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { laserSightAI } from '@game/ai/entity/laserSight/laserSightAI'
import { AIComponent } from '@game/components/aiComponent'
import { buildCollider, ColliderComponent } from '@game/components/colliderComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { Graphics } from 'pixi.js'
import { Category, CategorySet } from './category'
import { EntityFactory } from './entityFactory'

export class LaserSightFactory extends EntityFactory {
  constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    const g = new Graphics()
    g.position.set(0)
    const draw = new DrawComponent(entity, 'WorldUI')
    draw.addChild(g)

    entity.addComponent('Draw', draw)
    entity.addComponent(
      'Collider',
      new ColliderComponent(
        buildCollider({
          entity,
          geometry: { type: 'Ray' },
          category: Category.SENSOR,
          mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL, Category.HITBOX),
          isSensor: true,
        })
      )
    )
    entity.addComponent('AI', new AIComponent(laserSightAI(entity, this.world)))
    entity.addComponent('Position', new PositionComponent())

    return entity
  }
}
