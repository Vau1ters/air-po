import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAny } from '@core/behaviour/composite'
import { World } from '@core/ecs/world'
import { MouseCursorFactory } from '@game/entities/mouseCursorFactory'
import { KeyController } from '@game/systems/controlSystem'
import { getSingleton } from '@game/systems/singletonSystem'
import { InventoryWorldFactory } from '@game/worlds/inventoryWorldFactory'
import { fadeInOut } from '../common/animation/fadeInOut'
import { createInventoryUI } from './inventoryUI'

export const inventoryFlow = function*(gameWorld: World): Behaviour<void> {
  const player = getSingleton('Player', gameWorld)
  const [backAlphaFilter] = gameWorld.stage.getChildByName('blackSheet', true).filters as [
    PIXI.filters.AlphaFilter
  ]
  const { world, alphaFilter: frontAlphaFilter } = new InventoryWorldFactory().create()

  createInventoryUI(world, player)
  world.addEntity(player.getComponent('Player').ui)

  const cursor = new MouseCursorFactory().create()
  world.addEntity(cursor)

  const waitKey = function*(): Behaviour<void> {
    while (!KeyController.isActionPressed('Inventory')) yield
  }

  const fadeBack = fadeInOut(waitKey(), backAlphaFilter)
  const fadeFront = fadeInOut(waitKey(), frontAlphaFilter)

  yield* parallelAny([fadeBack, fadeFront, world.execute()])
  world.end()
}
