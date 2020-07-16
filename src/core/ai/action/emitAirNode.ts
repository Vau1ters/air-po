import { BehaviourNode, ExecuteResult } from '../behaviour'
import { AirFactory } from '../../entities/airFactory'
import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'

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

  protected async behaviour(): Promise<ExecuteResult> {
    const pos = this.entity.getComponent('Position')
    this.airFactory.setPosition(pos.x, pos.y)
    this.world.addEntity(this.airFactory.create())
    return 'Success'
  }
}
