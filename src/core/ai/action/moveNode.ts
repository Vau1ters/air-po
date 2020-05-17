import { PositionComponent } from '../../components/positionComponent'
import { Entity } from '../../ecs/entity'
import { BehaviourNode, NodeState } from '../behaviourNode'

export enum Direction {
  Left,
  Right,
  Up,
  Down,
}

export class MoveNode implements BehaviourNode {
  private timer = 0

  public constructor(
    private dir: Direction,
    private speed: number,
    private limitTime: number
  ) {}

  public initState(): void {
    this.timer = 0
  }

  public execute(entity: Entity): NodeState {
    const position = entity.getComponent('Position') as PositionComponent
    switch (this.dir) {
      case Direction.Left:
        position.x -= this.speed
        break
      case Direction.Right:
        position.x += this.speed
        break
      case Direction.Up:
        position.y -= this.speed
        break
      case Direction.Down:
        position.y += this.speed
        break
    }

    this.timer++
    if (this.timer > this.limitTime) {
      return NodeState.Success
    }
    return NodeState.Running
  }
}
