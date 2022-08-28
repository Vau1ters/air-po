import { Entity } from '@core/ecs/entity'
import { StaticComponent } from '@game/components/staticComponent'
import { TileCollider, TileEntityFactory } from '@game/entities/tileEntityFactory'
import wallCollider from '@res/collider/wallSoil.autogen.json'

export default class WallSoilFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    const colliderComponent = this.createCollider(entity, wallCollider as Array<TileCollider>)
    if (colliderComponent) {
      entity.addComponent('Collider', colliderComponent)
    }

    entity.addComponent('Draw', this.createDrawComponent(entity, 'wallSoil'))
    entity.addComponent('Static', new StaticComponent())

    return entity
  }
}
