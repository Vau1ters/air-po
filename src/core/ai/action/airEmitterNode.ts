import { BehaviourNode, NodeState } from '../behaviourNode'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'
import { AirFactory } from '../../entities/airFactory'

export class AirEmitterNode implements BehaviourNode {
  public airFactory: AirFactory

  public constructor(quantity: number) {
    this.airFactory = new AirFactory().setQuantity(quantity)
  }

  public initState(): void {
    // 何もしない
  }

  public execute(entity: Entity, world: World): NodeState {
    const pos = entity.getComponent('Position')
    this.airFactory.setPosition(pos.x, pos.y)
    world.addEntity(this.airFactory.create())
    return NodeState.Success
  }
}
