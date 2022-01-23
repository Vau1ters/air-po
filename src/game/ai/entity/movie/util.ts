import { Entity } from '@core/ecs/entity'
import { Family } from '@core/ecs/family'
import { Vec2 } from '@core/math/vec2'
import { MoviePosition } from '@game/movie/movie'
import { assert } from '@utils/assertion'

export const findActor = (name: string, nameFamily: Family): Entity => {
  const entity = nameFamily.entityArray.find(e => e.getComponent('Name').name === name)
  assert(entity !== undefined, `entity with name '${name} is not found`)
  return entity
}

export const resolvePosition = (pos: MoviePosition, nameFamily: Family): Vec2 => {
  const actor = findActor(pos.baseName, nameFamily)
  const result = actor.getComponent('Position')
  if (pos.offset) {
    return result.add(new Vec2(...pos.offset))
  } else {
    return result.copy()
  }
}
