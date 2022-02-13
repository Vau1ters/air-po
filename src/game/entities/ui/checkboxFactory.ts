import { Entity } from '@core/ecs/entity'
import { createSprite } from '@core/graphics/art'
import { CheckboxComponent } from '@game/components/checkboxComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { Container } from 'pixi.js'
import { EntityFactory } from '../entityFactory'
import { CheckboxUiSetting } from './loader/checkboxUiLoader'

export class CheckboxFactory extends EntityFactory {
  public constructor(private setting: CheckboxUiSetting) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    entity.addComponent('Checkbox', new CheckboxComponent(false))

    const drawContainer = new Container()

    const sprite = createSprite('checkbox')
    drawContainer.addChild(sprite)

    drawContainer.interactive = true
    drawContainer.buttonMode = true

    drawContainer.on('click', (): void => {
      const checkbox = entity.getComponent('Checkbox')
      checkbox.value = !checkbox.value

      sprite.state = checkbox.value ? 'On' : 'Off'
    })

    entity.addComponent(
      'Position',
      new PositionComponent(this.setting.position[0], this.setting.position[1])
    )
    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: drawContainer,
        },
        type: 'UI',
      })
    )

    return entity
  }
}
