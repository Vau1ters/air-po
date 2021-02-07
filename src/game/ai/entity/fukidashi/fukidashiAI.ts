import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { BitmapText, Sprite, Text } from 'pixi.js'

const chase = function*(fukidashi: Entity, target: Entity, camera: Entity): Behaviour<void> {
  const ui = fukidashi.getComponent('UI')
  const background = ui.getChildByName('background') as Sprite
  const text = ui.getChildByName('text') as Text

  const [uiFilter] = ui.filters
  const [backgroundFilter] = background.filters

  const targetPositionOnWorld = target.getComponent('Position')
  const cameraPositionOnWorld = camera.getComponent('Position')
  const fukidashiPositionOnScreen = new Vec2(ui.position.x, ui.position.y)
  const centerPositionOnScreen = new Vec2(windowSize.width * 0.5, windowSize.height * 0.5)

  const fukidashiPositionOnWorld = cameraPositionOnWorld.add(
    fukidashiPositionOnScreen.sub(centerPositionOnScreen)
  )
  const direction = targetPositionOnWorld.sub(fukidashiPositionOnWorld).normalize()

  while (true) {
    uiFilter.uniforms.anchor = [direction.x * 0.45 + 0.5, direction.y * 0.45 + 0.5]
    backgroundFilter.uniforms.direction = [direction.x, direction.y]
    yield
  }
}

const animate = function*(fukidashi: Entity): Behaviour<void> {
  const draw = fukidashi.getComponent('UI')
  const text = draw.getChildByName('text') as BitmapText
  const [filter] = draw.filters

  yield

  const wholeText = text.text
  const updateText = (newText: string): void => {
    text.text = newText
    text.updateText()
  }
  updateText('')

  let t = 0
  while (t < 1) {
    t += 0.01
    const t2 = Math.min(1, t * 5)
    filter.uniforms.scale = t2 * (2 - t2)
    filter.uniforms.angle = Math.sin(t * 30) * Math.exp(-t * t * 10) * 0.1
    yield
  }
  while (text.text.length < wholeText.length) {
    for (let i = 0; i < 3; i++) yield
    updateText(wholeText.substr(0, text.text.length + 1))
    yield
  }
  while (0 < t) {
    t -= 0.01
    const t2 = Math.min(1, t * 5)
    filter.uniforms.scale = t2 * (2 - t2)
    yield
  }
}

export const fukidashiAI = function(
  fukidashi: Entity,
  target: Entity,
  camera: Entity
): Behaviour<void> {
  return parallelAll([animate(fukidashi), chase(fukidashi, target, camera)])
}
