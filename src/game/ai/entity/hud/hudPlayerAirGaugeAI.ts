import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { Ui } from '@game/entities/ui/loader/uiLoader'

export const hudPlayerAirGaugeAI = function*(ui: Ui, player: Entity): Behaviour<void> {
  const airTank = player.getComponent('Equipment').airTank
  const holder = player.getComponent('AirHolder')
  const background = ui.getEntity('airTankBg')
  const airGauge = ui.getEntity('airGauge')

  while (true) {
    // 割合計算
    const maxQuantity = airTank.quantity * airTank.count
    const rate = Math.max(0, Math.min(1, holder.quantity / maxQuantity))
    airGauge.getComponent('Draw').width = rate * background.getComponent('Draw').width
    yield
  }
}
