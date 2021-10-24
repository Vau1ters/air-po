import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAny } from '@core/behaviour/composite'
import { Entity } from '@core/ecs/entity'
import { MouseCursorFactory } from '@game/entities/mouseCursorFactory'
import { KeyController } from '@game/systems/controlSystem'
import { InventoryWorldFactory } from '@game/worlds/inventoryWorldFactory'
import { fadeInOut } from '../common/animation/fadeInOut'
import { createInventoryUI } from './inventoryUI'

export const inventoryFlow = function*(player: Entity): Behaviour<void> {
  const { world, alphaFilter } = new InventoryWorldFactory().create()

  createInventoryUI(world, player)

  const cursor = new MouseCursorFactory().create()
  world.addEntity(cursor)

  const waitKey = function*(): Behaviour<void> {
    while (!KeyController.isActionPressed('Inventory')) yield
  }

  yield* parallelAny([fadeInOut(waitKey(), alphaFilter), world.execute()])
  world.end()
}
