import { BehaviourNode, ExecuteResult } from '../behaviour'
import { Entity } from '../../ecs/entity'
import Timer from '../../../utils/timer'

export enum Direction {
  Left,
  Right,
  Up,
  Down,
}

export class MoveNode extends BehaviourNode {
  private entity: Entity
  private direction: Direction
  private speed: number
  private mover: Timer

  public constructor(entity: Entity, direction: Direction, speed: number, duration: number) {
    super()
    this.entity = entity
    this.direction = direction
    this.speed = speed

    this.mover = new Timer(duration).onUpdate(() => this.moveEntity())
  }

  protected async behaviour(): Promise<ExecuteResult> {
    this.mover.start()
    await this.mover.end
    return 'Success'
  }

  private moveEntity(): void {
    const position = this.entity.getComponent('Position')
    switch (this.direction) {
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
  }
}
