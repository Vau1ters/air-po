import { Entity } from '@core/ecs/entity'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { EntityFactory } from './entityFactory'
import { Filter, BitmapText, Sprite } from 'pixi.js'
import fukidsahiVertexShader from '@res/shaders/fukidashi.vert'
import fukidashiFragmentShader from '@res/shaders/fukidashi.frag'
import fukidashiTextFragmentShader from '@res/shaders/fukidashiText.frag'
import { fukidashiAI } from '@game/ai/entity/fukidashi/fukidashiAI'
import { AIComponent } from '@game/components/aiComponent'

export class FukidashiFactory extends EntityFactory {
  constructor(public text: string, public target: Entity) {
    super()
  }

  create(): Entity {
    const entity = new Entity()

    const position = new PositionComponent()

    const draw = new DrawComponent(entity)
    draw.filters = [
      new Filter(fukidsahiVertexShader, undefined, {
        anchor: [0, 0],
        scale: 0,
        angle: 0,
      }),
    ]
    draw.sortableChildren = true

    const text = new BitmapText(this.text, {
      fontName: '����S�V�b�N',
      fontSize: 8,
    })
    text.name = 'text'
    text.roundPixels = true
    text.filters = [new Filter(undefined, fukidashiTextFragmentShader)]
    text.zIndex = 1
    draw.addChild(text)

    const tailSize = 10
    const radius = 2
    const border = 1
    const sprite = new Sprite()
    sprite.name = 'background'
    sprite.width = text.width + (tailSize + radius) * 2
    sprite.height = text.height + (tailSize + radius) * 2
    sprite.filters = [
      new Filter(undefined, fukidashiFragmentShader, {
        displaySize: [sprite.width, sprite.height],
        tailSize,
        radius,
        border,
      }),
    ]
    draw.addChild(sprite)

    entity.addComponent('Draw', draw)
    entity.addComponent('Position', position)
    entity.addComponent('AI', new AIComponent(fukidashiAI(entity, this.target)))
    return entity
  }
}
