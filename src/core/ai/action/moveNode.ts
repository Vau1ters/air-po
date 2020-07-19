import { Entity } from '../../ecs/entity'
import { BehaviourNode, Behaviour } from '../behaviourNode'

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
  private duration: number

  public constructor(entity: Entity, direction: Direction, speed: number, duration: number) {
    super()
    this.entity = entity
    this.direction = direction
    this.speed = speed
    this.duration = duration
  }

  protected *behaviour(): Behaviour {
    for (let time = 0; time < this.duration; time++) {
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
      yield
    }
    return 'Success'
  }
}
