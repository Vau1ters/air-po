import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { chain } from '@core/behaviour/composite'
import { In } from '@core/behaviour/easing/functions'
import { stream } from '@core/behaviour/easing/stream'
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
    stream(
      (value: number) => {
        t.text = text.substring(0, Math.floor(value))
        t.updateText()
      },
      0,
      [
        {
          easing: In.linear,
          duration: 5 * text.length,
          to: text.length,
        },
      ]
    ),
    wait(60),
    stream(
      (value: number) => {
        t.alpha = value
      },
      1,
      [
        {
          easing: In.linear,
          duration: 120,
          to: 0,
        },
      ]
    ),
  ])
}
