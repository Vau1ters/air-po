import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { BitmapText, Sprite, Text } from 'pixi.js'

const chase = function*(fukidashi: Entity, target: Entity): Behaviour<void> {
  const draw = fukidashi.getComponent('Draw')
  const background = draw.getChildByName('background') as Sprite
  const text = draw.getChildByName('text') as Text
  const fukidashiPosition = fukidashi.getComponent('Position')
  const targetPosition = target.getComponent('Position')
  const v = new Vec2(1, -1).normalize()
  const [drawFilter] = draw.filters
  const [backgroundFilter] = background.filters

  const size = new Vec2(draw.width, draw.height)
  const t = size.div(v.abs())
  const anchor = v
    .mul(-1)
    .mul(Math.min(t.x, t.y))
    .div(size)
    .mul(0.5)
    .add(0.5)
  background.position.set(-anchor.x * background.width, -anchor.y * background.height)
  text.position.set(
    -anchor.x * background.width - text.width / 2 + background.width / 2,
    -anchor.y * background.height - text.height / 2 + background.height / 2
  )

  while (true) {
    fukidashiPosition.x = targetPosition.x + v.x * 20
    fukidashiPosition.y = targetPosition.y + v.y * 20
    drawFilter.uniforms.anchor = [anchor.x, anchor.y]
    backgroundFilter.uniforms.target = [anchor.x, 1 - anchor.y]
    yield
  }
}

const animate = function*(fukidashi: Entity): Behaviour<void> {
  const draw = fukidashi.getComponent('Draw')
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

export const fukidashiAI = function(fukidashi: Entity, target: Entity): Behaviour<void> {
  return parallelAll([animate(fukidashi), chase(fukidashi, target)])
}
