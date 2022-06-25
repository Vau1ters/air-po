import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { laserSightAI } from '@game/ai/entity/laserSight/laserSightAI'
import { AiComponent } from '@game/components/aiComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { NameComponent } from '@game/components/nameComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { Graphics } from 'pixi.js'
import { EntityFactory } from './entityFactory'
import { loadEntity } from './loader/EntityLoader'

export class LaserSightFactory extends EntityFactory {
  constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = loadEntity('laserSight')

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
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent('Name', new NameComponent('LaserSight'))

    return entity
  }
}
