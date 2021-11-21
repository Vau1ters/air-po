import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { World } from '@core/ecs/world'
import { loadUi } from '@game/entities/ui/loader/uiLoader'
import { getSingleton } from '@game/systems/singletonSystem'
import { hudPlayerAirGaugeAI } from './hudPlayerAirGaugeAI'
import { hudPlayerAirTankAI } from './hudPlayerAirTankAI'
import { hudPlayerCoinAI } from './hudPlayerCoinAI'
import { hudPlayerHpAI } from './hudPlayerHpAI'
import { hudPlayerWeaponAI } from './hudPlayerWeaponAI'

export const hudPlayerAI = function*(world: World): Behaviour<void> {
  const ui = loadUi('hudPlayer', world)
  const player = getSingleton('Player', world)
  yield* parallelAll([
    hudPlayerAirTankAI(ui, player),
    hudPlayerAirGaugeAI(ui, player),
    hudPlayerWeaponAI(ui, player),
    hudPlayerHpAI(ui, player),
    hudPlayerCoinAI(ui, player),
  ])
}
