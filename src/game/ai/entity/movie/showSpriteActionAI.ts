import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { Family } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { PositionComponent } from '@game/components/positionComponent'
import { loadDrawComponent } from '@game/entities/loader/component/DrawComponentLoader'
import { ShowSpriteAction } from '@game/movie/movie'
import { resolvePosition } from './util'

export const showSpriteActionAI = function* (
  action: ShowSpriteAction,
  world: World,
  nameFamily: Family
): Behaviour<void> {
  const entity = new Entity()
  entity.addComponent('Draw', loadDrawComponent({ name: action.sprite }, entity))
  entity.addComponent(
    'Position',
    new PositionComponent().assign(resolvePosition(action.pos, nameFamily))
  )
  world.addEntity(entity)
  yield* wait.frame(100)
  world.removeEntity(entity)
}
