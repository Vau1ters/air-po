import { Entity } from '@core/ecs/entity'
import { StaticComponent } from '@game/components/staticComponent'
import { TileCollider, TileEntityFactory } from '@game/entities/tileEntityFactory'
import treeCollider from '@res/collider/tree.json'
import treeTileMapping from '@res/tileMapping/tree.json'

export default class TreeFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()
    const colliderComponent = this.createCollider(entity, treeCollider as Array<TileCollider>)
    if (colliderComponent) {
      entity.addComponent('Collider', colliderComponent)
    }
    entity.addComponent('Draw', this.createDrawComponent(entity, 'tree', treeTileMapping))
    entity.getComponent('Draw').zIndex = -1
    entity.addComponent('Static', new StaticComponent())
    return entity
  }
}
