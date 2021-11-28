import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { Ui } from '@game/entities/ui/loader/uiLoader'
import { animate } from '../common/action/animate'

export const hudPlayerWeaponAnimationAI = function*(ui: Ui, player: Entity): Behaviour<void> {
  const background = ui.get('weaponBackground')
  const transitTable: { [keys: string]: [string, string] } = {
    Default: ['SendStart1', 'Default'],
    SendStart1: ['SendStart2', 'SendEnd1'],
    SendStart2: ['SendStart3', 'SendEnd2'],
    SendStart3: ['SendStart3', 'SendEnd2'],
  }
  let state = 'Default'

  while (true) {
    yield* animate({ entity: background, waitFrames: 5, state })
    const hasShot = player.getComponent('Player').hasShot
    player.getComponent('Player').hasShot = false
    const next = transitTable[state]
    if (next) {
      if (hasShot) {
        state = next[0]
      } else {
        state = next[1]
      }
    } else {
      state = 'Default'
    }
  }
}
