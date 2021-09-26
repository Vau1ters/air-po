import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll, parallelAny } from '@core/behaviour/composite'
import { ease } from '@core/behaviour/easing/easing'
import { In, Out } from '@core/behaviour/easing/functions'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { getSingleton } from '@game/systems/singletonSystem'
import { BitmapText, Sprite } from 'pixi.js'

const chase = function*(speechBalloon: Entity, target: Entity, world: World): Behaviour<void> {
  const camera = getSingleton('Camera', world)
  const ui = speechBalloon.getComponent('Draw')
  const background = ui.getChildByName('background') as Sprite
  const targetPositionOnWorld = target.getComponent('Position')
  const cameraPositionOnWorld = camera.getComponent('Position')

  const [uiFilter] = ui.filters
  const [backgroundFilter] = background.filters

  while (true) {
    const speechBalloonPositionOnScreen = new Vec2(ui.position.x, ui.position.y)
    const centerPositionOnScreen = new Vec2(windowSize.width * 0.5, windowSize.height * 0.5)

    const speechBalloonPositionOnWorld = cameraPositionOnWorld.add(
      speechBalloonPositionOnScreen.sub(centerPositionOnScreen)
    )
    const target = targetPositionOnWorld.sub(speechBalloonPositionOnWorld)
    const direction = target.normalize()

    uiFilter.uniforms.anchor = [direction.x * 0.45 + 0.5, direction.y * 0.45 + 0.5]
    backgroundFilter.uniforms.target = [target.x, target.y]
    yield
  }
}

const updateBitmapText = (bitmapText: BitmapText, newText: string): void => {
  bitmapText.text = newText
  bitmapText.updateText()
}

const animate = function*(speechBalloon: Entity): Behaviour<void> {
  const draw = speechBalloon.getComponent('Draw')
  const bitmapText = draw.getChildByName('text') as BitmapText
  const [filter] = draw.filters

  const wholeText = bitmapText.text
  updateBitmapText(bitmapText, '')

  const popInspeechBalloonScale = ease(Out.quad)(20, value => (filter.uniforms.scale = value))
  const popInspeechBalloonAngle = ease(t => Math.sin(t * 24) * Math.exp(-t * t * 10) * 0.1)(
    80,
    value => (filter.uniforms.angle = value)
  )
  yield* parallelAll([popInspeechBalloonScale, popInspeechBalloonAngle])

  while (bitmapText.text.length < wholeText.length) {
    yield* wait(4)
    updateBitmapText(bitmapText, wholeText.substr(0, bitmapText.text.length + 1))
  }
  yield* wait(100)

  const popOutspeechBalloonScale = ease(In.quad)(20, value => (filter.uniforms.scale = value), {
    from: 1,
    to: 0,
  })
  yield* popOutspeechBalloonScale
}

export const speechBalloonAI = function(
  speechBalloon: Entity,
  target: Entity,
  world: World
): Behaviour<void> {
  return parallelAny([animate(speechBalloon), chase(speechBalloon, target, world)])
}
