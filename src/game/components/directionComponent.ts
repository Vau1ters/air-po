import { Entity } from '@core/ecs/entity'
import { AnimationSprite } from '@core/graphics/animation'
import { EventNotifier } from '@utils/eventNotifier'

export class HorizontalDirectionComponent {
  private _looking: HorizontalDirection
  public constructor(entity: Entity, looking: HorizontalDirection) {
    this._looking = looking

    const [sprite] = entity.getComponent('Draw').children as [AnimationSprite]
    this.changeDirection.addObserver(x => {
      if (x === 'Left') {
        sprite.scale.x = -1
      } else {
        sprite.scale.x = 1
      }
    })
  }

  set looking(value: HorizontalDirection) {
    this._looking = value
    this.changeDirection.notify(this._looking)
  }

  get looking(): HorizontalDirection {
    return this._looking
  }

  public readonly changeDirection = new EventNotifier<HorizontalDirection>()
}

export type HorizontalDirection = 'Left' | 'Right'
