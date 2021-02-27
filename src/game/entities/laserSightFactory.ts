import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { laserSightAI } from '@game/ai/entity/laserSight/laserSightAI'
import { AIComponent } from '@game/components/aiComponent'
import { ColliderBuilder, ColliderComponent } from '@game/components/colliderComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { Graphics } from 'pixi.js'
import { CategoryList } from './category'
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

    const collider = new ColliderComponent()
    collider.colliders.push(
      new ColliderBuilder()
        .setEntity(entity)
        .setRay({})
        .setCategory(CategoryList.laserSight)
        .setIsSensor(true)
        .build()
    )
    entity.addComponent('Collider', collider)

    entity.addComponent('AI', new AIComponent(laserSightAI(entity, this.world)))

    entity.addComponent('Position', new PositionComponent())

    return entity
  }
}
