import { Entity } from '@core/ecs/entity'
import { EntityFactory } from '../entityFactory'
import { DrawComponent } from '@game/components/drawComponent'
import { AIComponent } from '@game/components/aiComponent'
import { JetEffectAI } from '@game/ai/entity/jetEffect/jetEffectAI'
import { PositionComponent } from '@game/components/positionComponent'
import { World } from '@core/ecs/world'
import { createSprite } from '@core/graphics/art'

export class JetEffectFactory extends EntityFactory {
  private shooter?: Entity

  public constructor(private world: World) {
    super()
  }

  public setShooter(shooter: Entity): void {
    this.shooter = shooter
  }

  public create(): Entity {
    if (!this.shooter) {
      console.log('shooter is not defined')
      return new Entity()
    }

    const shooterPosition = this.shooter.getComponent('Position')

    const entity = new Entity()

    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: createSprite('jetEffect'),
        },
      })
    )
    entity.addComponent('AI', new AIComponent(JetEffectAI(entity, this.world)))
    entity.addComponent('Position', new PositionComponent(shooterPosition.x, shooterPosition.y))

    return entity
  }
}
