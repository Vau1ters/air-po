import { Entity } from '@core/ecs/entity'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { EntityFactory } from './entityFactory'
import { Text, Filter } from 'pixi.js'
import fukidsahiVertexShader from '@res/shaders/fukidashi.vert'
import fukidashiFragmentShader from '@res/shaders/fukidashi.frag'
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

    const text = new Text(this.text, {
      fontFamily: 'myFont',
      fontSize: 12,
      fill: 0,
    })
    const tailSize = 10
    const radius = 1
    const border = 1
    text.name = 'text'
    text.width += (tailSize + radius) * 2
    text.height += (tailSize + radius) * 2
    text.filters = [
      new Filter(fukidsahiVertexShader, fukidashiFragmentShader, {
        displaySize: [text.width, text.height],
        tailSize,
        radius,
        border,
        scale: 0,
        angle: 0,
      }),
    ]
    draw.addChild(text)

    entity.addComponent('Draw', draw)
    entity.addComponent('Position', position)
    entity.addComponent('AI', new AIComponent(fukidashiAI(entity, this.target)))
    return entity
  }
}
