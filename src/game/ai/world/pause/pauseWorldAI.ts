import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { ease } from '@core/behaviour/easing/easing'
import { In, Out } from '@core/behaviour/easing/functions'
import { World } from '@core/ecs/world'
import { ButtonFactory } from '@game/entities/ui/buttonFactory'
import { KeyController } from '@game/systems/controlSystem'
import { filters } from 'pixi.js'

export const pauseWorldAI = (gameWorld: World, alphaFilter: filters.AlphaFilter) =>
  function*(pauseWorld: World): Behaviour<void> {
    let hasResumeButtonPressed = false

    const button1 = new ButtonFactory()
      .setPosition(windowSize.width / 2, windowSize.height / 2 - 50)
      .onClick(() => {
        gameWorld.resume()
        hasResumeButtonPressed = true
      })
      .create()
    pauseWorld.addEntity(button1)

    const button2 = new ButtonFactory()
      .setPosition(windowSize.width / 2, windowSize.height / 2)
      .create()
    pauseWorld.addEntity(button2)

    const button3 = new ButtonFactory()
      .setPosition(windowSize.width / 2, windowSize.height / 2 + 50)
      .create()
    pauseWorld.addEntity(button3)

    yield* ease(Out.quad)(
      10,
      (value: number) => {
        alphaFilter.alpha = value
      },
      {
        from: 0,
        to: 1,
      }
    )

    while (!KeyController.isActionPressed('Pause') && !hasResumeButtonPressed) yield

    yield* ease(In.quad)(
      10,
      (value: number) => {
        alphaFilter.alpha = value
      },
      {
        from: 1,
        to: 0,
      }
    )

    gameWorld.resume()
  }
