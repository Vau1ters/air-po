import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { sequent } from '@core/behaviour/sequence'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { assert } from '@utils/assertion'
import { animate } from '../common/action/animate'
import { UIComponentFactory } from '@game/entities/ui/uiComponentFactory'
import AirDefinition from '@res/animation/uiAir.json'
import AirtankTailDefinition from '@res/animation/uiAirtankTail.json'
import AirtankBodyDefinition from '@res/animation/uiAirtankBody.json'
import AirtankBgDefinition from '@res/animation/uiAirtankBg.json'
import HpHeartDefinition from '@res/animation/uiHpHeart.json'
import WeaponBackgroundDefinition from '@res/animation/uiWeaponBackground.json'
import WeaponGunDefinition from '@res/animation/uiWeaponGun.json'

const UI_SETTING = {
  WEAPON: {
    x: 26,
    y: 22,
    paddingX: 1,
    paddingY: 1,
  },
  HP: {
    x: 47,
    y: 22,
    shiftX: 10,
    animationDelay: 16,
  },
  AIR_TANK: {
    x: 53,
    y: 32,
    shiftX: 8,
    paddingX: -3,
    paddingY: 2,
  },
}

const renderPlayerWeapon = function*(world: World): Behaviour<void> {
  const weaponGun = new UIComponentFactory(WeaponGunDefinition.sprite)
    .setPosition(
      UI_SETTING.WEAPON.x + UI_SETTING.WEAPON.paddingX,
      UI_SETTING.WEAPON.y + UI_SETTING.WEAPON.paddingY
    )
    .create()
  world.addEntity(weaponGun)
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
    yield* animate({ entity: hpHeart, state: 'Healing' })
    if (isLast) yield* animate({ entity: hpHeart, state: 'Sweat' })
    yield* animate({ entity: hpHeart, state: 'Full' })
  }
  const damagingAnimation = function*(hpHeart: Entity): Behaviour<void> {
    yield* animate({ entity: hpHeart, state: 'Damaging' })
    yield* animate({ entity: hpHeart, state: 'Empty' })
  }

  while (true) {
    while (renderingState.entities.length < hp.maxHp) {
      const hpHeart = new UIComponentFactory(HpHeartDefinition.sprite)
        .setPosition(
          UI_SETTING.HP.x + renderingState.entities.length * UI_SETTING.HP.shiftX,
          UI_SETTING.HP.y
        )
        .create()
      renderingState.entities.push(hpHeart)
      world.addEntity(hpHeart)
    }
    while (renderingState.entities.length > hp.maxHp) {
      const lastHpHeart = renderingState.entities.pop()
      assert(lastHpHeart, `Tried to remove hp gauge but current maxHp is ${hp.maxHp}.`)
      world.removeEntity(lastHpHeart)
    }

    if (renderingState.hp < hp.hp) {
      const hpHearts = renderingState.entities.slice(renderingState.hp, hp.hp)
      const animations = hpHearts.map((hpHeart, index) =>
        healingAnimation(hpHeart, index === hpHearts.length - 1)
      )
      renderingState.hp = hp.hp
      yield* sequent(animations, UI_SETTING.HP.animationDelay)
    }

    if (renderingState.hp > hp.hp) {
      const animations = renderingState.entities
        .slice(hp.hp, renderingState.hp)
        .reverse()
        .map(hpHeart => damagingAnimation(hpHeart))
      renderingState.hp = hp.hp
      yield* sequent(animations, UI_SETTING.HP.animationDelay)
    }

    yield
  }
}

const renderPlayerAir = function*(player: Entity, world: World): Behaviour<void> {
  const holder = player.getComponent('AirHolder')
  const airTank = player.getComponent('Equipment').airTank

  const airtankBg = new UIComponentFactory(AirtankBgDefinition.sprite)
    .setPosition(
      UI_SETTING.AIR_TANK.x + UI_SETTING.AIR_TANK.paddingX,
      UI_SETTING.AIR_TANK.y + UI_SETTING.AIR_TANK.paddingY
    )
    .create()
  const airtankBgDraw = airtankBg.getComponent('Draw')

  const renderingState: {
    tankBodies: Entity[]
    tankTail: Entity
  } = {
    tankBodies: [],
    tankTail: new UIComponentFactory(AirtankTailDefinition.sprite)
      .setPosition(UI_SETTING.AIR_TANK.x, UI_SETTING.AIR_TANK.y)
      .create(),
  }
  const tankTailPosition = renderingState.tankTail.getComponent('Position')

  const weaponBackground = new UIComponentFactory(WeaponBackgroundDefinition.sprite)
    .setPosition(UI_SETTING.WEAPON.x, UI_SETTING.WEAPON.y)
    .create()

  const airGauge = new UIComponentFactory(AirDefinition.sprite)
    .setPosition(
      UI_SETTING.AIR_TANK.x + UI_SETTING.AIR_TANK.paddingX,
      UI_SETTING.AIR_TANK.y + UI_SETTING.AIR_TANK.paddingY
    )
    .create()
  const airGaugeDraw = airGauge.getComponent('Draw')

  world.addEntity(airtankBg)
  world.addEntity(airGauge)
  world.addEntity(weaponBackground)
  world.addEntity(renderingState.tankTail)

  while (true) {
    while (renderingState.tankBodies.length + 1 < airTank.count) {
      const tankBody = new UIComponentFactory(AirtankBodyDefinition.sprite)
        .setPosition(
          UI_SETTING.AIR_TANK.x + renderingState.tankBodies.length * UI_SETTING.AIR_TANK.shiftX,
          UI_SETTING.AIR_TANK.y
        )
        .create()
      renderingState.tankBodies.push(tankBody)
      world.addEntity(tankBody)
    }
    while (renderingState.tankBodies.length + 1 > airTank.count) {
      const lastTankBody = renderingState.tankBodies.pop()
      assert(lastTankBody, `Tried to remove air tank but current tank count is ${airTank.count}.`)
      world.removeEntity(lastTankBody)
    }
    tankTailPosition.x =
      UI_SETTING.AIR_TANK.x + renderingState.tankBodies.length * UI_SETTING.AIR_TANK.shiftX

    airtankBgDraw.width = UI_SETTING.AIR_TANK.shiftX * airTank.count
    // 割合計算
    const maxQuantity = airTank.quantity * airTank.count
    const rate = Math.max(0, Math.min(1, holder.quantity / maxQuantity))
    airGaugeDraw.width = rate * UI_SETTING.AIR_TANK.shiftX * airTank.count

    yield
  }
}

export const playerUIAI = function*(world: World): Behaviour<void> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()

  for (const player of playerFamily.entityIterator) {
    yield* parallelAll([
      renderPlayerHp(player, world),
      renderPlayerAir(player, world),
      renderPlayerWeapon(world),
    ])
  }
}
