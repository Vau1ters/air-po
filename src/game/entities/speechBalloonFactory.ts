import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { Filter, BitmapText, Sprite } from 'pixi.js'
import speechBalloonVertexShader from '@res/shaders/speechBalloon.vert'
import speechBalloonFragmentShader from '@res/shaders/speechBalloon.frag'
import speechBalloonTextFragmentShader from '@res/shaders/speechBalloonText.frag'
import { speechBalloonAI } from '@game/ai/entity/speechBalloon/speechBalloonAI'
import { AIComponent } from '@game/components/aiComponent'
import { windowSize } from '@core/application'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'

export class SpeechBalloonFactory extends EntityFactory {
  constructor(private text: string, private target: Entity, private camera: Entity) {
    super()
  }

  create(): Entity {
    const entity = new Entity()

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

    const ui = new DrawComponent({ entity, type: 'UI' })
    ui.filters = [
      new Filter(speechBalloonVertexShader, undefined, {
        anchor: [0, 0],
        scale: 0,
        angle: 0,
      }),
    ]
    ui.sortableChildren = true

    const text = new BitmapText(this.text, {
      fontName: 'got',
      fontSize: 8,
    })
    text.name = 'text'
    text.roundPixels = true
    text.filters = [new Filter(undefined, speechBalloonTextFragmentShader)]
    text.zIndex = 1
    text.position.set(
      tailSize + padding - sprite.width * 0.5,
      tailSize + padding - sprite.height * 0.5
    )

    ui.addChild(sprite)
    ui.addChild(text)

    entity.addComponent('Draw', ui)
    entity.addComponent('AI', new AIComponent(speechBalloonAI(entity, this.target, this.camera)))
    entity.addComponent(
      'Position',
      new PositionComponent(windowSize.width * 0.5, sprite.height * 0.5)
    )
    return entity
  }
}
