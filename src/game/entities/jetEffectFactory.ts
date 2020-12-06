import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { DrawComponent } from '@game/components/drawComponent'
import { AIComponent } from '@game/components/aiComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import jetEffectDefinition from '@res/animation/jetEffect.json'
import { JetEffectAI } from '@game/ai/entity/jetEffect/jetEffectAI'
import { PositionComponent } from '@game/components/positionComponent'
import { World } from '@core/ecs/world'

type ShooterType = 'player' | 'enemy'

export class JetEffectFactory extends EntityFactory {
  public shooter?: Entity
  public shooterType: ShooterType = 'player'

  public constructor(private world: World) {
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
    const sprite = parseAnimation(jetEffectDefinition.sprite)
    const draw = new DrawComponent(entity)
    draw.addChild(sprite)

    const shooterPosition = this.shooter.getComponent('Position')
    const position = new PositionComponent(shooterPosition.x, shooterPosition.y)

    const ai = new AIComponent(JetEffectAI(entity, this.world))
    entity.addComponent('Draw', draw)
    entity.addComponent('AI', ai)
    entity.addComponent('Position', position)

    return entity
  }
}
