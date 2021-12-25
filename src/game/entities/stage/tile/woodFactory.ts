import { Entity } from '@core/ecs/entity'
import { StaticComponent } from '@game/components/staticComponent'
import { TileCollider, TileEntityFactory } from '@game/entities/tileEntityFactory'
import woodCollider from '@res/collider/wood.json'
import { getSpriteBuffer } from '@core/graphics/art'
import { DrawComponent } from '@game/components/drawComponent'
import { Sprite } from 'pixi.js'

export default class WoodFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()
    const colliderComponent = this.createCollider(entity, woodCollider as Array<TileCollider>)
    if (colliderComponent) {
      entity.addComponent('Collider', colliderComponent)
    }
    const sprite = new Sprite(getSpriteBuffer('wood').definitions['Default'].textures[this.frame])
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
    entity.getComponent('Draw').zIndex = -1
    entity.addComponent('Static', new StaticComponent())
    return entity
  }
}
