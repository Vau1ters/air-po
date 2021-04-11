import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { laserSightLockEffectAI } from '@game/ai/entity/laserSight/laserSightLockEffectAI'
import { AIComponent } from '@game/components/aiComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { Graphics } from 'pixi.js'
import { EntityFactory } from './entityFactory'

export class LaserSightLockFactory extends EntityFactory {
  constructor(private target: Entity, private isDespawning: () => boolean, private world: World) {
    super()
  }

  public create(): Entity {
    const lock = new Entity()
    lock.addComponent('Position', new PositionComponent())
    lock.addComponent(
      'Draw',
      new DrawComponent({
        entity: lock,
        type: 'WorldUI',
        child: { sprite: new Graphics() },
      })
    )
    lock.addComponent(
      'AI',
      new AIComponent(laserSightLockEffectAI(lock, this.target, this.isDespawning, this.world))
    )
    return lock
  }
}
