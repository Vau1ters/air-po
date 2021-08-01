import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { VineComponent } from '@game/components/vineComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { ColliderComponent, CollisionCallbackArgs } from '@game/components/colliderComponent'
import { AABB } from '@core/collision/geometry/AABB'
import { AIR_TAG } from '@game/systems/airSystem'
import { createSprite } from '@core/graphics/art'
import {
  VINE_TERRAIN_SENSOR_TAG,
  VINE_AIR_SENSOR_TAG,
  VINE_TAG,
} from '@game/entities/stage/tile/vineFactory'

const canExtend = (args: CollisionCallbackArgs): void => {
  const { me } = args
  const vine = me.entity.getComponent('Vine')
  vine.canExtend = false
}

const shouldShrink = (args: CollisionCallbackArgs): void => {
  const { me, other } = args
  if (other.tag.has(AIR_TAG)) {
    const vine = me.entity.getComponent('Vine')
    vine.shouldShrink = false
  }
}

export const addTag = (vine: Entity): void => {
  for (const collider of vine.getComponent('Collider').colliders) {
    if (collider.tag.has(VINE_TERRAIN_SENSOR_TAG)) {
      collider.callbacks.add(canExtend)
    } else if (collider.tag.has(VINE_AIR_SENSOR_TAG)) {
      collider.callbacks.add(shouldShrink)
    }
  }
}

const changeColliderLength = (colliderComponent: ColliderComponent, length: number): void => {
  for (const collider of colliderComponent.colliders) {
    const aabb = collider.geometry as AABB
    if (collider.tag.has(VINE_TAG)) {
      aabb.size.y = (length / 3) * 16
      aabb.center.y = aabb.size.y / 2
    }
    if (collider.tag.has(VINE_TERRAIN_SENSOR_TAG)) {
      aabb.center.y = (length / 3) * 16 - 8 + aabb.size.y
    }
  }
}

const changeSpritesLength = (draw: DrawComponent, vine: VineComponent): void => {
  const diff = vine.sprites.length - Math.ceil(vine.length / 3)
  if (diff > 0) {
    // 長いので短くする
    for (let i = 0; i < diff; i++) {
      draw.removeChild(vine.sprites[vine.sprites.length - 1])
      vine.sprites.pop()
    }
  }

  if (diff < 0) {
    // 短いので長くする
    for (let i = 0; i < -diff; i++) {
      const sprite = createSprite('vine')
      sprite.y = vine.sprites[vine.sprites.length - 1].y + 16
      draw.addChild(sprite)
      vine.sprites.push(sprite)
      sprite.state = 'Stalk2'
    }
  }

  // 変更したいフレーム名
  let frame = ''
  if (vine.length <= 3) {
    // 根
    frame = 'Root'
  } else {
    // 茎
    frame = 'Stalk'
  }
  frame = `${frame}${(vine.length - 1) % 3}`

  vine.sprites[vine.sprites.length - 1].state = frame
}

export const changeVineLength = function*(entity: Entity): Behaviour<void> {
  const vine = entity.getComponent('Vine')
  const collider = entity.getComponent('Collider')
  const draw = entity.getComponent('Draw')

  if (vine.shouldShrink) {
    // 空気がないので縮める
    if (vine.length > 1) {
      vine.length--
      changeColliderLength(collider, vine.length)
      changeSpritesLength(draw, vine)
    }
  } else if (vine.canExtend) {
    // 空気があってかつ壁がないので伸ばせる
    vine.length++
    changeColliderLength(collider, vine.length)
    changeSpritesLength(draw, vine)
  }

  vine.canExtend = true
  vine.shouldShrink = true
}
