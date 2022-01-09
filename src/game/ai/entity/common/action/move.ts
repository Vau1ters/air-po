import { Entity } from '@core/ecs/entity'
import { Behaviour } from '@core/behaviour/behaviour'

export type MoveDirection = 'Left' | 'Right' | 'Up' | 'Down'
export type MoveOption = {
  entity: Entity
  direction: MoveDirection
  speed: number
  duration: number
}

export const move = function* (option: MoveOption): Behaviour<void> {
  const position = option.entity.getComponent('Position')
  const direction = option.entity.getComponent('HorizontalDirection')
  for (let time = 0; time < option.duration; time++) {
    switch (option.direction) {
      case 'Left':
        position.x -= option.speed
        direction.looking = 'Left'
        break
      case 'Right':
        position.x += option.speed
        direction.looking = 'Right'
        break
      case 'Up':
        position.y -= option.speed
        break
      case 'Down':
        position.y += option.speed
        break
    }
    yield
  }
}
