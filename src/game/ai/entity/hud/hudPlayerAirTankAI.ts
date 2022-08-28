import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { Ui } from '@game/entities/ui/loader/uiLoader'

export const hudPlayerAirTankAI = function* (ui: Ui, player: Entity): Behaviour<void> {
  const airTankCount = () => {
    return player.getComponent('Player').getEquipmentCount('airTank')
  }

  const background = ui.get('airTankBg')
  const tail = ui.get('airTankTail')
  const tankBodies = ui.get('airTankBodies').getComponent('TileLayout')

  const hasTank = () => {
    return airTankCount() != 0
  }

  while (true) {
    background.getComponent('Draw').renderable = hasTank()
    tail.getComponent('Draw').renderable = hasTank()
    tankBodies.entities.map(x => {
      x.getComponent('Draw').renderable = hasTank()
    })

    tankBodies.count = airTankCount()
    const calcPos = (i: number): number => tankBodies.calcPos(i)[0]
    tail.getComponent('Position').x = calcPos(airTankCount())
    background.getComponent('Draw').width = calcPos(airTankCount() + 1) - calcPos(0)
    yield
  }
}
