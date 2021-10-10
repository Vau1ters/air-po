import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { inventoryItemCursorAI } from '@game/ai/entity/inventoryItemCursor/inventoryItemCursorAI'
import { AiComponent } from '@game/components/aiComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { MouseButton } from '@game/systems/controlSystem'
import { Sprite } from 'pixi.js'
import { EntityFactory } from './entityFactory'
import { loadEntity } from './loader/EntityLoader'

export type OnFocusCallback = () => void
export type OnClickCallback = (button: MouseButton) => void

export class InventoryItemFrameFactory extends EntityFactory {
  private pos = new Vec2()
  private onFocusCallback: OnFocusCallback = () => {}
  private onClickCallback: OnClickCallback = () => {}

  public create(): Entity {
    const entity = loadEntity('inventoryItemFrameSmall')

    const spriteForItemImage = new Sprite()
    spriteForItemImage.anchor.set(0.5)
    entity.getComponent('Draw').addChild(spriteForItemImage)

    entity.addComponent('Position', new PositionComponent(this.pos.x, this.pos.y))
    entity.addComponent(
      'Ai',
      new AiComponent({
        behaviour: inventoryItemCursorAI(entity, this.onFocusCallback, this.onClickCallback),
        dependency: {
          before: ['ControlSystem:update'],
          after: ['CollisionSystem:update'],
        },
      })
    )
    return entity
  }

  public setPos(pos: Vec2): InventoryItemFrameFactory {
    this.pos = pos
    return this
  }

  public onFocus(callback: OnFocusCallback): InventoryItemFrameFactory {
    this.onFocusCallback = callback
    return this
  }

  public onClick(callback: OnClickCallback): InventoryItemFrameFactory {
    this.onClickCallback = callback
    return this
  }
}
