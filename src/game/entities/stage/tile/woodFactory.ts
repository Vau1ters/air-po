import { Entity } from '@core/ecs/entity'
import { StaticComponent } from '@game/components/staticComponent'
import { TileCollider, TileEntityFactory } from '@game/entities/tileEntityFactory'
import woodCollider from '@res/collider/wood.json'
import woodTileMapping from '@res/tileMapping/wood.json'

export default class WoodFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()
    const colliderComponent = this.createCollider(entity, woodCollider as Array<TileCollider>)
    if (colliderComponent) {
      entity.addComponent('Collider', colliderComponent)
    }
    entity.addComponent('Draw', this.createDrawComponent(entity, 'wood', woodTileMapping))
    entity.getComponent('Draw').zIndex = -1
    entity.addComponent('Static', new StaticComponent())
    return entity
  }
}
