import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Graphics } from 'pixi.js'

const airGaugeUiSetting = {
  width: 8,
  height: 6,
  paddingRight: 0,
}

const renderPlayerWeapon = (player: Entity, weaponGraphics: Graphics): void => {
  weaponGraphics.clear()
  weaponGraphics.beginFill(0xff9900)
  weaponGraphics.drawRect(24, 20, 20, 20)
  weaponGraphics.endFill()
}

function renderPlayerHp(player: Entity, hpGauge: Graphics): void {
  const hp = player.getComponent('HP')
  hpGauge.clear()
  hpGauge.beginFill(0xff0000)
  for (let i = 0; i < hp.hp; i++) {
    hpGauge.drawCircle(52 + 10 * i, 24, 4)
  }
  hpGauge.endFill()
}

function renderPlayerAir(player: Entity, airGauge: Graphics): void {
  const holder = player.getComponent('AirHolder')
  const airTank = player.getComponent('Equipment').airTank

  airGauge.clear()
  for (let i = 0; i < airTank.count; i++) {
    // 割合計算
    const rate = Math.max(
      0,
      Math.min(1, (holder.quantity - airTank.quantity * i) / airTank.quantity)
    )
    // ゲージ
    airGauge.lineStyle()
    airGauge.beginFill(0x3080ff)
    airGauge.drawRect(
      49 + (airGaugeUiSetting.paddingRight + airGaugeUiSetting.width) * i,
      32,
      rate * airGaugeUiSetting.width,
      airGaugeUiSetting.height
    )

    airGauge.endFill()
  }

  // 枠
  airGauge.lineStyle(1, 0xffffff, 1, 1)
  airGauge.drawRect(
    49,
    32,
    (airGaugeUiSetting.paddingRight + airGaugeUiSetting.width) * airTank.count,
    airGaugeUiSetting.height
  )
}

export const playerUIAI = function*(entity: Entity, world: World): Behaviour<void> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()
  const [hpGauge, airGauge, weaponGraphics] = entity.getComponent('Draw').children
  while (true) {
    for (const player of playerFamily.entityIterator) {
      renderPlayerHp(player, hpGauge as Graphics)
      renderPlayerAir(player, airGauge as Graphics)
      renderPlayerWeapon(player, weaponGraphics as Graphics)
    }
    yield
  }
}
