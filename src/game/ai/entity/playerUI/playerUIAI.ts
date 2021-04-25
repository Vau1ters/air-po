import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { sequent } from '@core/behaviour/sequence'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { HpHeartFactory } from '@game/entities/ui/hpHeartFactory'
import { assert } from '@utils/assertion'
import { Graphics } from 'pixi.js'
import { animate } from '../common/action/animate'

const airGaugeUiSetting = {
  width: 8,
  height: 6,
  paddingRight: 0,
}

const renderPlayerWeapon = function*(player: Entity, weaponGraphics: Graphics): Behaviour<void> {
  while (true) {
    weaponGraphics.clear()
    weaponGraphics.beginFill(0xff9900)
    weaponGraphics.drawRect(24, 20, 20, 20)
    weaponGraphics.endFill()
    yield
  }
}

const renderPlayerHp = function*(player: Entity, world: World): Behaviour<void> {
  const hp = player.getComponent('HP')
  const renderingState: {
    entities: Entity[]
    hp: number
  } = {
    entities: [],
    hp: 0,
  }

  const healingAnimation = function*(hpHeart: Entity, isLast: boolean): Behaviour<void> {
    yield* animate(hpHeart, 'Healing')
    if (isLast) yield* animate(hpHeart, 'Sweat')
    yield* animate(hpHeart, 'Full')
  }
  const damagingAnimation = function*(hpHeart: Entity): Behaviour<void> {
    yield* animate(hpHeart, 'Damaging')
    yield* animate(hpHeart, 'Empty')
  }

  while (true) {
    while (renderingState.entities.length < hp.maxHp) {
      const hpHeart = new HpHeartFactory(renderingState.entities.length).create()
      renderingState.entities.push(hpHeart)
      world.addEntity(hpHeart)
    }
    while (renderingState.entities.length > hp.maxHp) {
      const lastHpHeart = renderingState.entities.pop()
      assert(lastHpHeart, 'Tried to remove hp gauge but current maxHp is 0.')
      world.removeEntity(lastHpHeart)
    }

    if (renderingState.hp < hp.hp) {
      const hpHearts = renderingState.entities.slice(renderingState.hp, hp.hp)
      const animations = hpHearts.map((hpHeart, index) =>
        healingAnimation(hpHeart, index === hpHearts.length - 1)
      )
      yield* sequent(animations, 16)
      renderingState.hp = hp.hp
    }

    if (renderingState.hp > hp.hp) {
      const animations = renderingState.entities
        .slice(hp.hp, renderingState.hp)
        .reverse()
        .map(hpHeart => damagingAnimation(hpHeart))
      yield* sequent(animations, 16)
      renderingState.hp = hp.hp
    }

    yield
  }
}

const renderPlayerAir = function*(player: Entity, airGauge: Graphics): Behaviour<void> {
  const holder = player.getComponent('AirHolder')
  const airTank = player.getComponent('Equipment').airTank

  while (true) {
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
    yield
  }
}

export const playerUIAI = function*(entity: Entity, world: World): Behaviour<void> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()
  const [_, airGauge, weaponGraphics] = entity.getComponent('Draw').children

  for (const player of playerFamily.entityIterator) {
    yield* parallelAll([
      renderPlayerHp(player, world),
      renderPlayerAir(player, airGauge as Graphics),
      renderPlayerWeapon(player, weaponGraphics as Graphics),
    ])
  }
}
