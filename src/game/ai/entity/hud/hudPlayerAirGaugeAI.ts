import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { Ui } from '@game/entities/ui/loader/uiLoader'
import { AirTank } from '@game/equipment/airTank'

export const hudPlayerAirGaugeAI = function* (ui: Ui, player: Entity): Behaviour<void> {
  const airTankCount = () => {
    return player.getComponent('Player').getEquipmentCount('airTank')
  }
  const holder = player.getComponent('AirHolder')
  const background = ui.get('airTankBg')
  const airGauge = ui.get('airGauge')

  const hasTank = () => {
    return airTankCount() != 0
  }

  while (true) {
    background.getComponent('Draw').renderable = hasTank()
    airGauge.getComponent('Draw').renderable = hasTank()

    // 割合計算
    const maxQuantity = AirTank.QUANTITY * airTankCount()
    const rate = Math.max(0, Math.min(1, holder.quantity / maxQuantity))
    airGauge.getComponent('Draw').width = rate * background.getComponent('Draw').width
    yield
  }
}
