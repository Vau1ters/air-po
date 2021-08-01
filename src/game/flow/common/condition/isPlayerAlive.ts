import { World } from '@core/ecs/world'
import { isAlive } from '@game/ai/entity/common/condition/isAlive'
import { getSingleton } from '@game/systems/singletonSystem'

export const isPlayerAlive = (world: World) => (): boolean => {
  const player = getSingleton('Player', world)
  return isAlive(player)()
}
