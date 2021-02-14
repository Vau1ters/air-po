import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { Ray } from '@core/collision/ray'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { CategoryList } from '@game/entities/category'
import { MouseController } from '@game/systems/controlSystem'
import PhysicsSystem from '@game/systems/physicsSystem'
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

function renderLaserSight(
  player: Entity,
  laserSight: Graphics,
  physicsSystem: PhysicsSystem
): void {
  const position = player.getComponent('Position')
  const mousePosition = MouseController.position
  const center = new Vec2(windowSize.width / 2, windowSize.height / 2)
  const direction = mousePosition.sub(center)
  const candidatePoints: Vec2[] = []
  for (const [category, bvh] of physicsSystem.bvhs) {
    if (
      CategoryList.bulletBody.mask.has(category) ||
      CategoryList.player.attack.mask.has(category)
    ) {
      const result = bvh.queryRaycast(new Ray(position, direction))
      candidatePoints.push(...result.map(item => item[1]))
    }
  }
  // candidatePointsが空配列だとエラーになるので、遠いところに点を置く
  const farPoint = position.add(
    direction.mul(
      Math.abs(Math.min(windowSize.width / direction.x, windowSize.height / direction.y))
    )
  )
  const hitPoint = candidatePoints
    .reduce((pre: Vec2, next: Vec2) => {
      if (position.sub(next).length() < position.sub(pre).length()) return next
      return pre
    }, farPoint)
    .sub(position)
    .add(center)
  laserSight.clear()
  laserSight.lineStyle(0.5, 0xff0000)
  laserSight.moveTo(center.x, center.y)
  laserSight.lineTo(hitPoint.x, hitPoint.y)
  laserSight.beginFill(0xff0000)
  laserSight.drawCircle(hitPoint.x, hitPoint.y, 2)
}

export const playerUIAI = function*(
  entity: Entity,
  world: World,
  physicsSystem: PhysicsSystem
): Behaviour<void> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()
  const [hpGauge, airGauge, laserSight] = entity.getComponent('UI').children
  while (true) {
    for (const player of playerFamily.entityIterator) {
      renderPlayerHp(player, hpGauge as Graphics)
      renderPlayerAir(player, airGauge as Graphics)
      renderLaserSight(player, laserSight as Graphics, physicsSystem)
    }
    yield
  }
}
