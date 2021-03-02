import { windowSize } from '@core/application'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { ButtonComponent } from '@game/components/buttonComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { Graphics } from 'pixi.js'
import { EntityFactory } from '../entityFactory'

export class ButtonFactory extends EntityFactory {
  private position: Vec2 = new Vec2(windowSize.width / 2, windowSize.height / 2)
  private size: Vec2 = new Vec2(100, 25)
  private readonly buttonComponent = new ButtonComponent()

  public setPosition(x: number, y: number): this {
    this.position.x = x
    this.position.y = y

    return this
  }

  public setSize(width: number, height: number): this {
    this.size.x = width
    this.size.y = height

    return this
  }

  public onClick(callback: () => void): this {
    this.buttonComponent.clickEvent.addObserver(callback)

    return this
  }

  public create(): Entity {
    const entity = new Entity()

    const positionComponent = new PositionComponent(
      this.position.x - this.size.x / 2,
      this.position.y - this.size.y / 2
    )

    const drawComponent = new DrawComponent(entity)
    const g = new Graphics()
    g.beginFill(0xff00ff)
    g.drawRect(0, 0, this.size.x, this.size.y)
    g.endFill()
    drawComponent.addChild(g)
    drawComponent.interactive = true
    drawComponent.buttonMode = true
    drawComponent.addListener('click', () => this.buttonComponent.clickEvent.notify())
    drawComponent.addListener('mouseover', () => this.buttonComponent.mouseoverEvent.notify())
    drawComponent.addListener('mouseout', () => this.buttonComponent.mouseoutEvent.notify())

    this.buttonComponent.mouseoverEvent.addObserver((): void => {
      g.clear()
      g.beginFill(0xff88ff)
      g.drawRect(0, 0, this.size.x, this.size.y)
      g.endFill()
    })
    this.buttonComponent.mouseoutEvent.addObserver((): void => {
      g.clear()
      g.beginFill(0xff00ff)
      g.drawRect(0, 0, this.size.x, this.size.y)
      g.endFill()
    })

    entity.addComponent('Button', this.buttonComponent)
    entity.addComponent('Position', positionComponent)
    entity.addComponent('Draw', drawComponent)

    return entity
  }
}
