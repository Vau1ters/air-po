import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { DrawComponent } from '@game/components/drawComponent'
import { AIComponent } from '@game/components/aiComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import airEffectDefinition from '@res/animation/airEffect.json'
import { airEffectAI } from '@game/ai/entity/airEffect/airEffectAI'
import { PositionComponent } from '@game/components/positionComponent'

type ShooterType = 'player' | 'enemy'

export class AirEffectFactory extends EntityFactory {
  public shooter?: Entity
  public shooterType: ShooterType = 'player'
  public constructor() {
    super()
  }

  public setShooter(shooter: Entity, shooterType: ShooterType): void {
    this.shooter = shooter
    this.shooterType = shooterType
  }
  public create(): Entity {
    if (!this.shooter) {
      console.log('shooter is not defined')
      return new Entity()
    }

    const entity = new Entity()
    const sprite = parseAnimation(airEffectDefinition.sprite)
    const draw = new DrawComponent(entity)
    draw.addChild(sprite)

    const shooterPosition = this.shooter.getComponent('Position')
    const position = new PositionComponent(shooterPosition.x, shooterPosition.y)

    const ai = new AIComponent(airEffectAI(entity))
    entity.addComponent('Draw', draw)
    entity.addComponent('AI', ai)
    entity.addComponent('Position', position)

    return entity
  }
}
