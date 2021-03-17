import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Graphics } from 'pixi.js'

const airGaugeUiSetting = {
  width: 10,
  height: 24,
  paddingRight: 6,
  paddingTop: 0,
}

function renderPlayerHp(player: Entity, hpGauge: Graphics): void {
  const hp = player.getComponent('HP')
  hpGauge.clear()
  hpGauge.beginFill(0x30ff70)
  hpGauge.drawRect(0, 0, hp.ratio * windowSize.width, 16)
  hpGauge.endFill()
}

function renderPlayerAir(player: Entity, airGauge: Graphics): void {
  const holder = player.getComponent('AirHolder')
  const airTank = player.getComponent('Equipment').airTank

  airGauge.clear()
  for (let i = 0; i < airTank.count; i++) {
    // 枠
    airGauge.lineStyle(1, 0xffffff, 1, 1)
    airGauge.drawRect(
      (airGaugeUiSetting.paddingRight + airGaugeUiSetting.width) * i,
      airGaugeUiSetting.paddingTop,
      airGaugeUiSetting.width,
      airGaugeUiSetting.height
    )

    // 割合計算
    const rate = Math.max(
      0,
      Math.min(1, (holder.quantity - airTank.quantity * i) / airTank.quantity)
    )
    // ゲージ
    airGauge.lineStyle()
    airGauge.beginFill(0x3080ff)
    airGauge.drawRect(
      (airGaugeUiSetting.paddingRight + airGaugeUiSetting.width) * i,
      airGaugeUiSetting.paddingTop + (1 - rate) * airGaugeUiSetting.height,
      airGaugeUiSetting.width,
      rate * airGaugeUiSetting.height
    )
    airGauge.endFill()
  }
}

export const playerUIAI = function*(entity: Entity, world: World): Behaviour<void> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()
  const [hpGauge, airGauge] = entity.getComponent('UI').children
  while (true) {
    for (const player of playerFamily.entityIterator) {
      renderPlayerHp(player, hpGauge as Graphics)
      renderPlayerAir(player, airGauge as Graphics)
    }
    yield
  }
}
