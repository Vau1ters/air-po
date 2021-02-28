import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { KeyController } from '@game/systems/controlSystem'

export const pauseWorldAI = (gameWorld: World) =>
  function*(): Behaviour<void> {
    while (!KeyController.isActionPressed('Pause')) yield
    gameWorld.resume()
  }
