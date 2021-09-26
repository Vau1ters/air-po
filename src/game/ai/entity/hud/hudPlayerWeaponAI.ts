import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { UIComponentFactory } from '@game/entities/ui/uiComponentFactory'

const UI_SETTING = {
  WEAPON: {
    x: 26,
    y: 22,
    paddingX: 1,
    paddingY: 1,
  },
}

export const hudPlayerWeaponAI = function*(world: World): Behaviour<void> {
  const weaponGun = new UIComponentFactory('uiWeaponGun')
    .setPosition(
      UI_SETTING.WEAPON.x + UI_SETTING.WEAPON.paddingX,
      UI_SETTING.WEAPON.y + UI_SETTING.WEAPON.paddingY
    )
    .create()
  world.addEntity(weaponGun)
}
