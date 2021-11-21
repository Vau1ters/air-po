import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { Ui } from '@game/entities/ui/loader/uiLoader'

export const hudPlayerAirTankAI = function*(ui: Ui, player: Entity): Behaviour<void> {
  const airTankCount = player.getComponent('Player').getEquipmentCount('airTank')

  const background = ui.get('airTankBg')
  const tail = ui.get('airTankTail')
  const tankBodies = ui.get('airTankBodies').getComponent('TileLayout')

  while (true) {
    tankBodies.count = airTankCount
    const calcPos = (i: number): number => tankBodies.calcPos(i)[0]
    tail.getComponent('Position').x = calcPos(airTankCount)
    background.getComponent('Draw').width = calcPos(airTankCount + 1) - calcPos(0)
    yield
  }
}
