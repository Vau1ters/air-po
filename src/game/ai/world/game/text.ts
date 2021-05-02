import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { chain } from '@core/behaviour/composite'
import { ease } from '@core/behaviour/easing/easing'
import { In } from '@core/behaviour/easing/functions'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { BitmapText } from 'pixi.js'

export const Text = (world: World, text: string): Behaviour<void> => {
  const entity = new Entity()
  const ui = new DrawComponent({ entity, type: 'UI' })
  const t = new BitmapText(text, {
    fontName: 'got',
    fontSize: 16,
  })

  ui.addChild(t)
  entity.addComponent(
    'Position',
    new PositionComponent(windowSize.width / 2 - t.width / 2, windowSize.height / 2)
  )
  entity.addComponent('Draw', ui)
  world.addEntity(entity)

  return chain([
    ease(In.linear)(
      5 * text.length,
      (value: number) => {
        t.text = text.substring(0, Math.floor(value))
        t.updateText()
      },
      {
        from: 0,
        to: text.length,
      }
    ),
    wait(60),
    ease(In.linear)(
      120,
      (value: number) => {
        t.alpha = value
      },
      {
        from: 1,
        to: 0,
      }
    ),
  ])
}
