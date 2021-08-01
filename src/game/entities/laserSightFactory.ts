import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { laserSightAI } from '@game/ai/entity/laserSight/laserSightAI'
import { AiComponent } from '@game/components/aiComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { Graphics } from 'pixi.js'
import { EntityFactory } from './entityFactory'
import { SegmentSearcherFactory } from './segmentSearcherFactory'

export class LaserSightFactory extends EntityFactory {
  constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new SegmentSearcherFactory().addCategoryToMask('enemyHitbox', 'terrain').create()

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
      'Ai',
      new AiComponent({
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
