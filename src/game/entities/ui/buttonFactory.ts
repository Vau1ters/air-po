import { Entity } from '@core/ecs/entity'
import { ButtonComponent } from '@game/components/buttonComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { BitmapText, Container, Graphics } from 'pixi.js'
import { EntityFactory } from '../entityFactory'
import { ButtonUiSetting } from './loader/buttonUiLoader'

export class ButtonFactory extends EntityFactory {
  public constructor(private setting: ButtonUiSetting) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    entity.addComponent('Button', new ButtonComponent())

    const drawContainer = new Container()
    drawContainer.interactive = true
    drawContainer.buttonMode = true
    drawContainer.addListener('click', () => entity.getComponent('Button').clickEvent.notify())
    drawContainer.addListener('mouseover', () =>
      entity.getComponent('Button').mouseoverEvent.notify()
    )
    drawContainer.addListener('mouseout', () =>
      entity.getComponent('Button').mouseoutEvent.notify()
    )

    const t = new BitmapText(this.setting.text, {
      fontName: 'got',
      fontSize: this.setting.fontSize,
      tint: 0x000000,
    })
    const size = {
      width: t.getBounds().width + 2,
      height: t.getBounds().height + 2,
    }

    const g = new Graphics()
    g.lineStyle(1, 0x000000)
    g.drawRect(0, 0, size.width, size.height)

    g.beginFill(0xffffff)
    g.drawRect(0, 0, size.width, size.height)
    g.endFill()

    drawContainer.addChild(g)
    drawContainer.addChild(t)

    entity.getComponent('Button').mouseoverEvent.addObserver((): void => {
      g.clear()

      g.lineStyle(2, 0x000000)
      g.drawRect(0, 0, size.width, size.height)

      g.beginFill(0xffffff)
      g.drawRect(0, 0, size.width, size.height)
      g.endFill()
    })
    entity.getComponent('Button').mouseoutEvent.addObserver((): void => {
      g.clear()

      g.lineStyle(1, 0x000000)
      g.drawRect(0, 0, size.width, size.height)

      g.beginFill(0xffffff)
      g.drawRect(0, 0, size.width, size.height)
      g.endFill()
    })

    entity.addComponent(
      'Position',
      new PositionComponent(
        this.setting.position[0] - size.width / 2,
        this.setting.position[1] - size.height / 2
      )
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
