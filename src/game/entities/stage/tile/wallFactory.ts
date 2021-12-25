import { Entity } from '@core/ecs/entity'
import { getSpriteBuffer } from '@core/graphics/art'
import { DrawComponent } from '@game/components/drawComponent'
import { StaticComponent } from '@game/components/staticComponent'
import { TileCollider, TileEntityFactory } from '@game/entities/tileEntityFactory'
import { Sprite } from 'pixi.js'
import wallCollider from '@res/collider/wall.json'

export default class WallFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    const colliderComponent = this.createCollider(entity, wallCollider as Array<TileCollider>)
    if (colliderComponent) {
      entity.addComponent('Collider', colliderComponent)
    }

    const sprite = new Sprite(getSpriteBuffer('wall').definitions['Default'].textures[this.frame])
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
    entity.addComponent('Static', new StaticComponent())

    return entity
  }
}
