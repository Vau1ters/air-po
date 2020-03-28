import { PositionComponent } from '../../components/positionComponent'
import { Entity } from '../../ecs/entity'
import { Node, NodeState } from '../node'

export class GoRight implements Node {
  private timer = 0

  public initState(): void {
    this.timer = 0
  }

  public execute(entity: Entity): NodeState {
    const position = entity.getComponent('Position') as PositionComponent
    position.x += 2
    this.timer++
    if (this.timer > 60) {
      return NodeState.Success
    }
    return NodeState.Running
  }
}
