import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { MouseCursorFactory } from '@game/entities/mouseCursorFactory'
import { KeyController } from '@game/systems/controlSystem'
import { getSingleton } from '@game/systems/singletonSystem'
import { overlayFlow } from '../common/flow/overlayFlow'
import { createShopUI } from './shopUI'
import { ShopWorldFactory } from './shopWorldFactory'

export const shopFlow = function* (gameWorld: World): Behaviour<void> {
  const player = getSingleton('Player', gameWorld)
  const world = new ShopWorldFactory().create()

  createShopUI(world)
  world.addEntity(player.getComponent('Player').ui)

  const cursor = new MouseCursorFactory().create()
  world.addEntity(cursor)

  yield* overlayFlow(world, { until: () => KeyController.isActionPressed('Shop') })
}
