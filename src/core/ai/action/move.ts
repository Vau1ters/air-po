import { Entity } from '../../ecs/entity'
import { Behaviour } from '../behaviour'

export enum Direction {
  Left,
  Right,
  Up,
  Down,
}

export const move = function*(
  entity: Entity,
  direction: Direction,
  speed: number,
  duration: number
): Behaviour<void> {
  for (let time = 0; time < duration; time++) {
    const position = entity.getComponent('Position')
    switch (direction) {
      case Direction.Left:
        position.x -= speed
        break
      case Direction.Right:
        position.x += speed
        break
      case Direction.Up:
        position.y -= speed
        break
      case Direction.Down:
        position.y += speed
        break
    }
    yield
  }
}
