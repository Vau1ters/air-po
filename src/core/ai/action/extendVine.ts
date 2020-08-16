import { Behaviour } from '../behaviour'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'
import { VineFactory } from '../../entities/vineFactory'
import { Collider } from '../../components/colliderComponent'
import { kill } from './kill'

const canExtend = (me: Collider, other: Collider): void => {
  if (!other.isSensor) {
    const vine = me.component.entity.getComponent('Vine')
    vine.canExtend = false
  }
}

const shouldShrink = (me: Collider, other: Collider): void => {
  if (other.tag.has('air')) {
    const vine = me.component.entity.getComponent('Vine')
    vine.shouldShrink = false
  }
}

let factory: VineFactory
export const addTag = (vine: Entity): void => {
  for (const collider of vine.getComponent('Collider').colliders) {
    if (collider.tag.has('vineSensor')) {
      collider.callbacks.add(canExtend)
    }
    if (collider.tag.has('vine')) {
      collider.callbacks.add(shouldShrink)
    }
  }
}

// TODO:名前変える
export const extendVine = function*(entity: Entity, world: World): Behaviour<void> {
  const vine = entity.getComponent('Vine')

  if (vine.child != undefined) return

  if (vine.shouldShrink && vine.parent) {
    vine.parent.getComponent('Vine').child = undefined
    yield* kill(entity, world)
    return
  }

  if (vine.canExtend && !vine.shouldShrink) {
    if (!factory) factory = new VineFactory(world)
    factory.parent = entity
    const childVine = factory.create()
    addTag(childVine)
    const childPosition = childVine.getComponent('Position')
    const position = entity.getComponent('Position')
    childPosition.x = position.x
    childPosition.y = position.y + 16
    world.addEntity(childVine)
  }

  vine.canExtend = true
  vine.shouldShrink = true
}
