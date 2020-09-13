import { Behaviour } from '../behaviour'
import { Entity } from '../../ecs/entity'
import { Collider, ColliderComponent, AABBCollider } from '../../components/colliderComponent'
import { VineComponent } from '../../components/vineComponent'
import vineDefinition from '../../../../res/entities/vine.json'
import { DrawComponent } from '../../components/drawComponent'
import { parseSprite } from '../../parser/spriteParser'

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

const changeColliderLength = (colliderComponent: ColliderComponent, length: number): void => {
  for (const collider of colliderComponent.colliders) {
    if (collider.tag.has('vine')) {
      ;(collider as AABBCollider).aabb.size.y = (length / 3) * 16
    }
    if (collider.tag.has('vineSensor')) {
      ;(collider as AABBCollider).aabb.position.y = (length / 3) * 16 - 8
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
      const anim = parseSprite(vineDefinition.sprite)
      anim.y = vine.sprites[vine.sprites.length - 1].y + 16
      draw.addChild(anim)
      vine.sprites.push(anim)
      anim.changeTo('Stalk2')
    }
  }

  let frame = ''
  if (vine.length < 3) {
    // 根
    frame = 'Root'
  } else {
    // 茎
    frame = 'Stalk'
  }
  switch ((vine.length - 1) % 3) {
    case 0:
      frame = frame + '0'
      break
    case 1:
      frame = frame + '1'
      break
    case 2:
      frame = frame + '2'
      break
    default:
      throw 'バーカ'
  }
  vine.sprites[vine.sprites.length - 1].changeTo(frame)
}

// TODO:名前変えるS
// TODO:チラチラするのを抑える
export const extendVine = function*(entity: Entity): Behaviour<void> {
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
