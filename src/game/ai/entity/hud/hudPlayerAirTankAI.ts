import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { Ui } from '@game/entities/ui/loader/uiLoader'

export const hudPlayerAirTankAI = function*(ui: Ui, player: Entity): Behaviour<void> {
  const airTank = player.getComponent('Equipment').airTank

  const background = ui.get('airTankBg')
  const tail = ui.get('airTankTail')
  const tankBodies = ui.get('airTankBodies').getComponent('TileLayout')

  while (true) {
    tankBodies.count = airTank.count
    const calcPos = (i: number): number => tankBodies.calcPos(i)[0]
    tail.getComponent('Position').x = calcPos(airTank.count)
    background.getComponent('Draw').width = calcPos(airTank.count + 1) - calcPos(0)
    yield
  }
}
