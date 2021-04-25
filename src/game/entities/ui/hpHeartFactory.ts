import { EntityFactory } from '../entityFactory'
import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import hpHeartDefinition from '@res/animation/hpHeart.json'

export class HpHeartFactory extends EntityFactory {
  constructor(private index: number) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    entity.addComponent('Position', new PositionComponent(52 + 10 * this.index, 24))
    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: parseAnimation(hpHeartDefinition.sprite),
        },
        type: 'UI',
      })
    )
    entity.addComponent('AnimationState', new AnimationStateComponent(entity))
    return entity
  }
}
