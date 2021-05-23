import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { laserSightAI } from '@game/ai/entity/laserSight/laserSightAI'
import { AIComponent } from '@game/components/aiComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { Graphics } from 'pixi.js'
import { Category } from './category'
import { EntityFactory } from './entityFactory'
import { RaySearcherFactory } from './raySearcherFactory'

export class LaserSightFactory extends EntityFactory {
  constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new RaySearcherFactory()
      .addCategoryToMask(Category.ENEMY_HITBOX, Category.TERRAIN)
      .create()

    const g = new Graphics()
    g.position.set(0)

    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: g,
        },
        type: 'WorldUI',
      })
    )
    entity.addComponent(
      'AI',
      new AIComponent({
        behaviour: laserSightAI(entity, this.world),
        name: 'LaserSight:AI',
        dependency: {
          after: ['Player:AI', 'PhysicsSystem:update'],
        },
      })
    )

    return entity
  }
}
