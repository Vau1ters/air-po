import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { assert } from '@utils/assertion'
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

export const hudPlayerAirAI = function*(world: World): Behaviour<void> {
  const player = getSingleton('Player', world)
  const holder = player.getComponent('AirHolder')
  const airTank = player.getComponent('Equipment').airTank

  const airtankBg = new UIComponentFactory('uiAirtankBg')
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
    tankTail: new UIComponentFactory('uiAirtankTail')
      .setPosition(UI_SETTING.AIR_TANK.x, UI_SETTING.AIR_TANK.y)
      .create(),
  }
  const tankTailPosition = renderingState.tankTail.getComponent('Position')

  const weaponBackground = new UIComponentFactory('uiWeaponBackground')
    .setPosition(UI_SETTING.WEAPON.x, UI_SETTING.WEAPON.y)
    .create()

  const airGauge = new UIComponentFactory('uiAir')
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

  const hoge = function*(): Behaviour<void> {
    while (true) {
      while (renderingState.tankBodies.length + 1 < airTank.count) {
        const tankBody = new UIComponentFactory('uiAirtankBody')
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

  yield* parallelAll([
    animate({ entity: weaponBackground, loopCount: Infinity, waitFrames: 3 }),
    hoge(),
  ])
}
