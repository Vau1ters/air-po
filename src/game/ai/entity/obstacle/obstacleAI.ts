import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { kill } from '../common/action/kill'

const changeSprite = function*(entity: Entity): Behaviour<void> {
  const sprite = entity.getComponent('AnimationState').animation.currentAnimationSprite
  const hp = entity.getComponent('Hp')
  while (hp.hp > 0) {
    sprite.goto(hp.maxHp - hp.hp)
    const currentHp = hp.hp
    yield* wait.until((): boolean => currentHp !== hp.hp)
  }
}

export const obstacleAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* changeSprite(entity)
  yield* kill(entity, world)
}
