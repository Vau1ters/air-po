import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { shopScrollAI } from '@game/ai/entity/shop/shopScrollAI'
import { AiComponent } from '@game/components/aiComponent'
import { loadUi } from '@game/entities/ui/loader/uiLoader'
import { Graphics } from 'pixi.js'

const createMask = (background: Entity): Graphics => {
  const Margin = 5
  const { x: maskX, y: maskY } = background.getComponent('Position')
  const { width: maskWidth, height: maskHeight } = background.getComponent('Draw')
  return new Graphics()
    .beginFill(0xffffff)
    .drawRect(
      maskX - maskWidth / 2 + Margin,
      maskY - maskHeight / 2 + Margin,
      maskWidth - Margin * 2,
      maskHeight - Margin * 2
    )
    .endFill()
}

export const createShopUI = (world: World): void => {
  const ui = loadUi('shop', world)
  const background = ui.get('background')
  const uiContainer = world.stage.getChildByName('ui', true)
  uiContainer.mask = createMask(background)
  background.addComponent(
    'Ai',
    new AiComponent(background, {
      behaviour: shopScrollAI(ui, world),
      dependency: {
        before: ['ControlSystem:update'],
        after: ['CollisionSystem:update'],
      },
    })
  )
}
