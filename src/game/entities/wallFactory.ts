import { Entity } from '@core/ecs/entity'
import { getSpriteBuffer } from '@core/graphics/art'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { StaticComponent } from '@game/components/staticComponent'
import { EntityFactory } from '@game/entities/entityFactory'
import { loadEntity } from '@game/entities/loader/EntityLoader'
import { Sprite } from 'pixi.js'

export default class WallFactory extends EntityFactory {
  constructor(private pos: Vec2, private tileId: number, private shouldCollide: boolean) {
    super()
  }

  public create(): Entity {
    const entity = this.shouldCollide ? loadEntity('wall') : new Entity()

    const sprite = new Sprite(getSpriteBuffer('wall').definitions['Default'].textures[this.tileId])
    sprite.anchor.set(0.5)

    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite,
        },
      })
    )
    entity.addComponent('Position', new PositionComponent(this.pos.x, this.pos.y))
    entity.addComponent('Static', new StaticComponent())

    return entity
  }
}
