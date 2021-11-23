import { Behaviour } from '@core/behaviour/behaviour'
import { AABB } from '@core/collision/geometry/AABB'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { loadEntity } from '@game/entities/loader/EntityLoader'
import {
  VINE_TERRAIN_SENSOR_TAG,
  VINE_AIR_SENSOR_TAG,
  VineDirection,
  VINE_TAG,
} from '@game/entities/stage/object/vineFactory'
import { assert } from '@utils/assertion'
import { animate } from '../common/action/animate'

type VineStatus = 'Extend' | 'Shrink'
type Vine = { vine: Entity; world: World; dir: VineDirection; stalks: Array<Entity> }

const getVector = (dir: VineDirection): Vec2 => {
  switch (dir) {
    case 'Down':
      return new Vec2(0, +1)
    case 'Up':
      return new Vec2(0, -1)
    case 'Left':
      return new Vec2(-1, 0)
    case 'Right':
      return new Vec2(+1, 0)
  }
}

const setup = (vine: Vine): void => {
  const collider = vine.vine.getComponent('Collider')
  const animation = vine.vine.getComponent('AnimationState')
  const dirVec = getVector(vine.dir)

  // set direction of waiting image
  animation.state = `${vine.dir}Root`

  // shift terrain sensor to the direction
  const terrainSensor = collider.getByTag(VINE_TERRAIN_SENSOR_TAG)?.geometry as AABB
  terrainSensor.center.assign(terrainSensor.center.add(dirVec.mul(16)))

  // set air sensor onto the core in the image
  const airSensor = collider.getByTag(VINE_AIR_SENSOR_TAG)?.geometry as AABB
  airSensor.center.assign(airSensor.center.add(dirVec.mul(-4)))
}

const waitForStatusChange = function*(vine: Vine): Behaviour<VineStatus> {
  let foundWall = false
  const wallSensorCallback = (): void => {
    foundWall = true
  }
  const wallSensor = vine.vine.getComponent('Collider').getByTag(VINE_TERRAIN_SENSOR_TAG)

  let inAir = false
  const airSensorCallback = (): void => {
    inAir = true
  }
  const airSensor = vine.vine.getComponent('Collider').getByTag(VINE_AIR_SENSOR_TAG)

  const addCallbacks = (): void => {
    wallSensor?.callbacks.add(wallSensorCallback)
    airSensor?.callbacks.add(airSensorCallback)
  }
  const deleteCallbacks = (): void => {
    wallSensor?.callbacks.delete(wallSensorCallback)
    airSensor?.callbacks.delete(airSensorCallback)
  }
  addCallbacks()
  while (true) {
    yield
    if (!foundWall && inAir) {
      deleteCallbacks()
      return 'Extend'
    }
    if (!inAir && vine.stalks.length > 0) {
      deleteCallbacks()
      return 'Shrink'
    }
    foundWall = false
    inAir = false
  }
}

const extend = function*(vine: Vine): Behaviour<Entity> {
  if (vine.stalks.length === 0) {
    yield* animate({
      entity: vine.vine,
      state: `${vine.dir}Root`,
      waitFrames: 2,
    })
  }

  const collider = vine.vine.getComponent('Collider')
  const shift = getVector(vine.dir).mul(16)

  const body = collider.getByTag(VINE_TAG)?.geometry as AABB
  body.size.assign(body.size.add(shift.abs()))
  body.center.assign(body.center.add(shift.mul(0.5)))

  const terrainSensor = collider.getByTag(VINE_TERRAIN_SENSOR_TAG)?.geometry as AABB
  terrainSensor.center.assign(terrainSensor.center.add(shift))

  const lastStalk = vine.stalks[vine.stalks.length - 1] ?? vine.vine
  const newPos = lastStalk.getComponent('Position').add(shift)
  const stalk = loadEntity('vineStalk')
  stalk.addComponent('Position', newPos)
  vine.world.addEntity(stalk)
  vine.stalks.push(stalk)

  yield* animate({
    entity: stalk,
    state: `${vine.dir}Stalk`,
    waitFrames: 2,
  })

  return stalk
}

const shrink = function*(vine: Vine): Behaviour<Entity> {
  const collider = vine.vine.getComponent('Collider')
  const shift = getVector(vine.dir).mul(-16)

  const body = collider.getByTag(VINE_TAG)?.geometry as AABB
  body.size.assign(body.size.sub(shift.abs()))
  body.center.assign(body.center.add(shift.mul(0.5)))

  const terrainSensor = collider.getByTag(VINE_TERRAIN_SENSOR_TAG)?.geometry as AABB
  terrainSensor.center.assign(terrainSensor.center.add(shift))

  const stalk = vine.stalks.pop()
  assert(stalk !== undefined, '')

  yield* animate({
    entity: stalk,
    state: `${vine.dir}Stalk`,
    waitFrames: 2,
    reverse: true,
  })
  vine.world.removeEntity(stalk)

  if (vine.stalks.length === 0) {
    yield* animate({
      entity: vine.vine,
      state: `${vine.dir}Root`,
      waitFrames: 2,
      reverse: true,
    })
  }

  return stalk
}

export const vineAI = function*(entity: Entity, world: World, dir: VineDirection): Behaviour<void> {
  const vine: Vine = { vine: entity, world, dir, stalks: [] }
  setup(vine)
  while (true) {
    const status = yield* waitForStatusChange(vine)
    switch (status) {
      case 'Extend':
        yield* extend(vine)
        break
      case 'Shrink':
        yield* shrink(vine)
        break
    }
  }
}
