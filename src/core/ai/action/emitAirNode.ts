import { BehaviourNode, Behaviour } from '../behaviourNode'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'
import { AirFactory } from '../../entities/airFactory'

export class EmitAirNode extends BehaviourNode {
  private entity: Entity
  private world: World
  private airFactory: AirFactory

  public constructor(entity: Entity, world: World, quantity: number) {
    super()
    this.entity = entity
    this.world = world
    this.airFactory = new AirFactory().setQuantity(quantity)
  }

  protected *behaviour(): Behaviour {
    const pos = this.entity.getComponent('Position')
    this.airFactory.setPosition(pos.x, pos.y)
    this.world.addEntity(this.airFactory.create())
    yield
    return 'Success'
  }
}
