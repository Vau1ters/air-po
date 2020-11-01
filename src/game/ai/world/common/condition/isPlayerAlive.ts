import { Family } from '@core/ecs/family'
import { isAlive } from '@game/ai/entity/common/condition/isAlive'
import { assert } from '@utils/assertion'

export const isPlayerAlive = (playerFamily: Family) => (): boolean => {
  assert(playerFamily.entityArray.length === 1)
  const playerEntity = playerFamily.entityArray[0]
  return isAlive(playerEntity)()
}
