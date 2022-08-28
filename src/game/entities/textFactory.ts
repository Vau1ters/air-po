import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { normalizeText } from '@utils/text'
import { BitmapText } from 'pixi.js'
import { EntityFactory } from './entityFactory'

export type TextFactorySetting = {
  text?: string
  fontSize: number
  pos?: Vec2
  tint?: number
}

export class TextFactory extends EntityFactory {
  constructor(private setting: TextFactorySetting) {
    super()
  }

  create(): Entity {
    const entity = new Entity()
    const ui = new DrawComponent({ entity, type: 'UI' })
    const t = new BitmapText(normalizeText(this.setting.text ?? ''), {
      fontName: 'got',
      fontSize: this.setting.fontSize,
      tint: this.setting.tint,
    })
    t.anchor.set(0, 0.5)

    ui.addChild(t)
    entity.addComponent('Position', new PositionComponent(this.setting.pos?.x, this.setting.pos?.y))
    entity.addComponent('Draw', ui)

    return entity
  }
}
