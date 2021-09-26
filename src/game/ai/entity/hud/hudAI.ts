import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { World } from '@core/ecs/world'
import { hudPlayerAirAI } from '@game/ai/entity/hud/hudPlayerAirAI'
import { hudPlayerHpAI } from '@game/ai/entity/hud/hudPlayerHpAI'
import { hudPlayerWeaponAI } from '@game/ai/entity/hud/hudPlayerWeaponAI'

export const hudAI = function*(world: World): Behaviour<void> {
  yield* parallelAll([hudPlayerHpAI(world), hudPlayerAirAI(world), hudPlayerWeaponAI(world)])
}
