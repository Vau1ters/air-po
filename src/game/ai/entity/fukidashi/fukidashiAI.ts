import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { Text } from 'pixi.js'

const chase = function*(fukidashi: Entity, target: Entity): Behaviour<void> {
  const text = fukidashi.getComponent('Draw').getChildByName('text') as Text
  const [filter] = text.filters
  const fukidashiPosition = fukidashi.getComponent('Position')
  const targetPosition = target.getComponent('Position')
  const v = new Vec2(1, -1).normalize()

  const size = new Vec2(text.width, text.height)
  const t = size.div(v.abs())
  const anchor = v
    .mul(-1)
    .mul(Math.min(t.x, t.y))
    .div(size)
    .mul(0.5)
    .add(0.5)
  text.anchor.set(anchor.x, anchor.y)

  while (true) {
    fukidashiPosition.x = targetPosition.x + v.x * 20
    fukidashiPosition.y = targetPosition.y + v.y * 20
    filter.uniforms.target = [anchor.x, anchor.y]
    yield
  }
}

const animate = function*(fukidashi: Entity): Behaviour<void> {
  const draw = fukidashi.getComponent('Draw')
  const text = draw.getChildByName('text') as Text
  const [filter] = text.filters

  const wholeText = text.text
  text.updateText(true)
  const wholeTextSize = [text.texture.trim.width, text.texture.trim.height]
  text.text = ''

  let t = 0
  while (t < 1) {
    t += 0.01
    const t2 = Math.min(1, t * 5)
    filter.uniforms.scale = t2 * (2 - t2)
    filter.uniforms.angle = Math.sin(t * 30) * Math.exp(-t * t * 10) * 0.1
    yield
  }
  while (text.text.length < wholeText.length) {
    for (let i = 0; i < 10; i++) yield
    text.text = wholeText.substr(0, text.text.length + 1)
    text.updateText(true)
    const textSize = text.texture.trim
    filter.uniforms.textRate = [
      textSize.width / wholeTextSize[0],
      textSize.height / wholeTextSize[1],
    ]
    yield
  }
  t = 0
}

export const fukidashiAI = function(fukidashi: Entity, target: Entity): Behaviour<void> {
  return parallelAll([animate(fukidashi), chase(fukidashi, target)])
}
