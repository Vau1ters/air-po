import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { MouseController } from '@game/systems/controlSystem'

export const switchWeapon = function*(entity: Entity): Behaviour<void> {
  while (true) {
    yield* wait.until((): boolean => MouseController.wheel !== 0)
    entity.getComponent('Player').changeWeapon(Math.sign(MouseController.wheel))
    yield* wait.frame(10)
  }
}
