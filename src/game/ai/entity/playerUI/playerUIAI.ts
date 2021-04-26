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
import HpHeartDefinition from '@res/animation/uiHpHeart.json'
import WeaponBackgroundDefinition from '@res/animation/uiWeaponBackground.json'
import WeaponGunDefinition from '@res/animation/uiWeaponGun.json'

const renderPlayerWeapon = function*(world: World): Behaviour<void> {
  const weaponGun = new UIComponentFactory(WeaponGunDefinition.sprite).setPosition(26, 22).create()
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
      const hpHeart = new UIComponentFactory(HpHeartDefinition.sprite)
        .setPosition(47 + renderingState.entities.length * 10, 22)
        .create()
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
      renderingState.hp = hp.hp
      yield* sequent(animations, 16)
    }

    if (renderingState.hp > hp.hp) {
      const animations = renderingState.entities
        .slice(hp.hp, renderingState.hp)
        .reverse()
        .map(hpHeart => damagingAnimation(hpHeart))
      renderingState.hp = hp.hp
      yield* sequent(animations, 16)
    }

    yield
  }
}

const renderPlayerAir = function*(player: Entity, world: World): Behaviour<void> {
  const holder = player.getComponent('AirHolder')
  const airTank = player.getComponent('Equipment').airTank

  const renderingState: {
    tankBodies: Entity[]
    tankTail: Entity
  } = {
    tankBodies: [],
    tankTail: new UIComponentFactory(AirtankTailDefinition.sprite).setPosition(53, 32).create(),
  }
  const tankTailPosition = renderingState.tankTail.getComponent('Position')

  const weaponBackground = new UIComponentFactory(WeaponBackgroundDefinition.sprite)
    .setPosition(24, 20)
    .create()

  const airGauge = new UIComponentFactory(AirDefinition.sprite).setPosition(50, 33).create()
  const airGaugeDraw = airGauge.getComponent('Draw')

  world.addEntity(airGauge)
  world.addEntity(weaponBackground)
  world.addEntity(renderingState.tankTail)

  while (true) {
    while (renderingState.tankBodies.length + 1 < airTank.count) {
      const tankBody = new UIComponentFactory(AirtankBodyDefinition.sprite)
        .setPosition(renderingState.tankBodies.length * 8 + 53, 32)
        .create()
      renderingState.tankBodies.push(tankBody)
      world.addEntity(tankBody)
    }
    while (renderingState.tankBodies.length + 1 > airTank.count) {
      const lastTankBody = renderingState.tankBodies.pop()
      assert(lastTankBody, 'Tried to remove air tank but current tank count is 0.')
      world.removeEntity(lastTankBody)
    }
    tankTailPosition.x = 53 + renderingState.tankBodies.length * 8

    // 割合計算
    const maxQuantity = airTank.quantity * airTank.count
    const rate = Math.max(0, Math.min(1, holder.quantity / maxQuantity))
    airGaugeDraw.width = rate * 8 * airTank.count

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
