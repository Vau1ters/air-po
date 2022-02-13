import { Entity } from '@core/ecs/entity'
import { getTexture } from '@core/graphics/art'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { SliderComponent } from '@game/components/sliderComponent'
import { MouseController } from '@game/systems/controlSystem'
import { BitmapText, Container, Graphics, InteractionEvent, Rectangle, Sprite } from 'pixi.js'
import { EntityFactory } from '../entityFactory'
import { SliderUiSetting } from './loader/sliderUiLoader'

export class SliderFactory extends EntityFactory {
  public constructor(private setting: SliderUiSetting) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    entity.addComponent('Slider', new SliderComponent())

    const size = {
      width: 100,
      height: 10,
    }

    const drawContainer = new Container()
    drawContainer.width = size.width
    drawContainer.height = size.height

    const g = new Graphics()
    g.lineStyle(1, 0x000000)

    g.moveTo(0, 0)
    g.lineTo(0, size.height)

    g.moveTo(size.width, 0)
    g.lineTo(size.width, size.height)

    g.moveTo(0, size.height / 2)
    g.lineTo(size.width, size.height / 2)

    drawContainer.addChild(g)

    const sprite = new Sprite(getTexture('sliderCursor'))
    sprite.anchor.set(0.5, 0)
    drawContainer.addChild(sprite)
    entity.getComponent('Slider').addCallback((value: number): void => {
      sprite.position.set(value * size.width, -10)
    })

    const t = new BitmapText('', {
      fontName: 'got',
      fontSize: 8,
      tint: 0x000000,
    })
    t.position.set(size.width + 10, 0)
    drawContainer.addChild(t)
    entity.getComponent('Slider').addCallback((value: number): void => {
      t.text = `${Math.floor(value * 100)}%`.padStart(4, ' ')
    })

    drawContainer.interactive = true
    drawContainer.buttonMode = true
    drawContainer.hitArea = new Rectangle(
      0,
      -sprite.height,
      size.width,
      sprite.height + size.height
    )

    let dragging = false
    const updateSlider = (e: InteractionEvent): void => {
      if (!dragging) return
      const x = Math.max(0, Math.min(size.width, e.data.global.x - this.setting.position[0]))
      entity.getComponent('Slider').value = x / size.width
    }
    drawContainer.on('mousedown', (e: InteractionEvent): void => {
      dragging = true
      updateSlider(e)
    })
    drawContainer.on('mousemove', (e: InteractionEvent): void => {
      dragging = dragging && MouseController.isMousePressing('Left')
      updateSlider(e)
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
