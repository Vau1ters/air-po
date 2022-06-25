import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { Entity } from '@core/ecs/entity'
import { MouseController } from '@game/systems/controlSystem'
import { getSingleton } from '@game/systems/singletonSystem'
import { wait } from '@core/behaviour/wait'
import { FamilyBuilder } from '@core/ecs/family'
import { assert } from '@utils/assertion'
import { Vec2 } from '@core/math/vec2'
import { Movie } from '@game/movie/movie'
export const search = function* (entity: Entity, world: World): Behaviour<void> {
  const nameFamily = new FamilyBuilder(world).include('Name').build()
  const drone = nameFamily.entityArray.find(e => e.getComponent('Name').name === 'Drone')
  assert(drone !== undefined, 'Drone not found')
  while (true) {
    yield* wait.until(() => MouseController.isMousePressed('Left'))
    const target = entity.getComponent('Player').searchTarget
    if (target?.hasComponent('Library')) {
      const targetPos = target.getComponent('Position').add(new Vec2(0, -48))
      const dronePos = drone.getComponent('Position')
      const dif = targetPos.sub(dronePos)
      const droneDestination = dronePos.add(dif.normalize().mul(Math.max(0, dif.length() - 16)))
      const gameEvent = getSingleton('GameEvent', world).getComponent('GameEvent')
      const movie: Movie = [
        {
          action: 'camera',
          to: [targetPos.x, targetPos.y],
          type: 'ease',
          chase: false,
        },
        {
          action: 'move',
          mover: 'Drone',
          to: [droneDestination.x, droneDestination.y],
          type: 'ease',
        },
      ]

      const msg = target.getComponent('Library').description.join('\n')
      movie.push({
        action: 'talk',
        speaker: 'Drone',
        content: msg,
      })
      gameEvent.event = {
        type: 'movie',
        movie: movie,
      }
    }
    yield
  }
}
