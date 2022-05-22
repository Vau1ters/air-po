import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { Filter, BitmapText, Sprite } from 'pixi.js'
import speechBalloonVertexShader from '@res/shaders/speechBalloon.vert'
import speechBalloonFragmentShader from '@res/shaders/speechBalloon.frag'
import speechBalloonTextFragmentShader from '@res/shaders/speechBalloonText.frag'
import { speechBalloonAI } from '@game/ai/entity/speechBalloon/speechBalloonAI'
import { AiComponent } from '@game/components/aiComponent'
import { windowSize } from '@core/application'
import { normalizeText } from '@utils/text'
import { TextFactory } from './textFactory'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'

export type SpeechBalloonConfig = {
  fontSize: number
  tint: number
  waitForEnd: Behaviour<void>
}

export class SpeechBalloonFactory extends EntityFactory {
  constructor(
    private text: string,
    private target: Entity,
    private world: World,
    private config: SpeechBalloonConfig
  ) {
    super()
  }

  create(): Entity {
    const entity = new TextFactory({
      text: normalizeText(this.text),
      fontSize: this.config.fontSize,
      tint: this.config.tint,
    }).create()

    const tailSize = 20
    const radius = 10
    const padding = radius / Math.sqrt(2)
    const border = 1
    const sprite = new Sprite()
    sprite.name = 'background'
    sprite.width = windowSize.width
    sprite.height = windowSize.height * 0.4
    sprite.anchor.set(0.5)
    sprite.filters = [
      new Filter(undefined, speechBalloonFragmentShader, {
        displaySize: [sprite.width, sprite.height],
        tailSize,
        radius,
        border,
      }),
    ]

    const ui = entity.getComponent('Draw')
    ui.filters = [
      new Filter(speechBalloonVertexShader, undefined, {
        anchor: [0, 0],
        scale: 0,
        angle: 0,
      }),
    ]
    ui.sortableChildren = true

    const [text] = ui.children as [BitmapText]
    text.name = 'text'
    text.roundPixels = true
    text.filters = [new Filter(undefined, speechBalloonTextFragmentShader)]
    text.zIndex = 1
    text.position.set(
      tailSize + padding - sprite.width * 0.5,
      tailSize + padding - sprite.height * 0.5
    )

    ui.addChildAt(sprite, 0)

    entity.addComponent(
      'Ai',
      new AiComponent(entity, {
        behaviour: speechBalloonAI(entity, this.target, this.world, this.config.waitForEnd),
        dependency: {
          before: ['ControlSystem:update'],
        },
      })
    )
    entity.getComponent('Position').x = windowSize.width * 0.5
    entity.getComponent('Position').y = sprite.height * 0.5
    return entity
  }
}
