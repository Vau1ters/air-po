import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { ease } from '@core/behaviour/easing/easing'
import { Out } from '@core/behaviour/easing/functions'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { createSprite, SpriteName } from '@core/graphics/art'
import { WeaponType } from '@game/components/playerComponent'
import { Ui } from '@game/entities/ui/loader/uiLoader'
import { DisplayObject, Graphics } from 'pixi.js'

const weaponSpriteName = (type: WeaponType): SpriteName => {
  switch (type) {
    case 'Gun':
      return 'uiWeaponGun'
    case 'AirNade':
      return 'uiWeaponAirNade'
  }
}

const createMask = (ui: Entity): Graphics => {
  const { x: maskX, y: maskY } = ui.getComponent('Position')
  const { width: maskWidth, height: maskHeight } = ui.getComponent('Draw')
  return new Graphics()
    .beginFill(0xffffff)
    .drawRect(maskX, maskY, maskWidth, maskHeight)
    .endFill()
}

export const hudPlayerWeaponAI = function*(ui: Ui, player: Entity): Behaviour<void> {
  const playerComponent = player.getComponent('Player')
  const weaponUi = ui.get('weapon')
  const weaponDraw = weaponUi.getComponent('Draw')
  weaponDraw.mask = createMask(weaponUi)

  let weapon = playerComponent.currentWeapon
  while (true) {
    const delta = yield* wait.notification(playerComponent.weaponChanged)
    weapon = playerComponent.currentWeapon
    weaponDraw.addChild(createSprite(weaponSpriteName(weapon), { x: 0, y: 0 }))

    const rotate = (
      sprite: DisplayObject,
      option: { from: number; to: number }
    ): Behaviour<void> => {
      return ease(Out.quad)(
        15,
        (value: number): void => {
          const angle = (value * Math.PI) / 180
          const r = 16
          const x = r * Math.cos(angle)
          const y = r * (Math.sin(angle) - 1)
          sprite.position.set(x, y)
        },
        option
      )
    }

    yield* parallelAll([
      rotate(weaponDraw.children[0], { from: 90, to: 90 + 90 * delta }),
      rotate(weaponDraw.children[1], { from: 90 - 90 * delta, to: 90 }),
    ])
    weaponDraw.removeChildAt(0)
    playerComponent.weaponChanging = false
  }
}
