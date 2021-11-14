import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { UIComponentFactory } from '@game/entities/ui/uiComponentFactory'
import { getSingleton } from '@game/systems/singletonSystem'
import { animate } from '../common/action/animate'
import { parallelAll } from '@core/behaviour/composite'

const UI_SETTING = {
  AIR_TANK: {
    x: 53,
    y: 32,
    shiftX: 8,
    paddingX: -3,
    paddingY: 2,
  },
  // TODO: hudPlayerWeaponAIと合わせたい
  WEAPON: {
    x: 26,
    y: 22,
    paddingX: 1,
    paddingY: 1,
  },
}

const airTankAI = function*(world: World): Behaviour<void> {
  const player = getSingleton('Player', world)
  const airTankCount = player.getComponent('Player').getEquipmentCount('airTank')

  const background = new UIComponentFactory('uiAirTankBg')
    .setPosition(
      UI_SETTING.AIR_TANK.x + UI_SETTING.AIR_TANK.paddingX,
      UI_SETTING.AIR_TANK.y + UI_SETTING.AIR_TANK.paddingY
    )
    .create()
  world.addEntity(background)

  const tail = new UIComponentFactory('uiAirTankTail')
    .setPosition(UI_SETTING.AIR_TANK.x, UI_SETTING.AIR_TANK.y)
    .create()
  world.addEntity(tail)

  const tankBodies = []

  const supplyBody = (): void => {
    while (tankBodies.length + 1 < airTankCount) {
      const tankBody = new UIComponentFactory('uiAirTankBody')
        .setPosition(
          UI_SETTING.AIR_TANK.x + tankBodies.length * UI_SETTING.AIR_TANK.shiftX,
          UI_SETTING.AIR_TANK.y
        )
        .create()
      tankBodies.push(tankBody)
      world.addEntity(tankBody)
    }
  }

  const updateTail = (): void => {
    const tankTailPosition = tail.getComponent('Position')
    tankTailPosition.x = UI_SETTING.AIR_TANK.x + tankBodies.length * UI_SETTING.AIR_TANK.shiftX
  }

  while (true) {
    supplyBody()
    updateTail()
    background.getComponent('Draw').width = UI_SETTING.AIR_TANK.shiftX * airTankCount
    yield
  }
}

const weaponAI = function*(world: World): Behaviour<void> {
  const player = getSingleton('Player', world)
  const background = new UIComponentFactory('uiWeaponBackground')
    .setPosition(UI_SETTING.WEAPON.x, UI_SETTING.WEAPON.y)
    .create()
  world.addEntity(background)

  const transitTable: { [keys: string]: [string, string] } = {
    Default: ['SendStart1', 'Default'],
    SendStart1: ['SendStart2', 'SendEnd1'],
    SendStart2: ['SendStart3', 'SendEnd2'],
    SendStart3: ['SendStart3', 'SendEnd2'],
  }
  let state = 'Default'

  while (true) {
    yield* animate({ entity: background, waitFrames: 5, state })
    const hasShot = player.getComponent('Player').hasShot
    player.getComponent('Player').hasShot = false
    const next = transitTable[state]
    if (next) {
      if (hasShot) {
        state = next[0]
      } else {
        state = next[1]
      }
    } else {
      state = 'Default'
    }
  }
}

const airGaugeAI = function*(world: World): Behaviour<void> {
  const player = getSingleton('Player', world)
  const airTankCount = player.getComponent('Player').getEquipmentCount('airTank')
  const holder = player.getComponent('AirHolder')

  const airGauge = new UIComponentFactory('uiAir')
    .setPosition(
      UI_SETTING.AIR_TANK.x + UI_SETTING.AIR_TANK.paddingX,
      UI_SETTING.AIR_TANK.y + UI_SETTING.AIR_TANK.paddingY
    )
    .create()
  world.addEntity(airGauge)

  while (true) {
    // 割合計算
    const rate = Math.max(0, Math.min(1, holder.quantity / holder.maxQuantity))
    airGauge.getComponent('Draw').width = rate * UI_SETTING.AIR_TANK.shiftX * airTankCount
    yield
  }
}

export const hudPlayerAirAI = function*(world: World): Behaviour<void> {
  yield* parallelAll([airTankAI(world), weaponAI(world), airGaugeAI(world)])
}
