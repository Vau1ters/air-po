import { Vec2 } from '@core/math/vec2'
import { Graphics } from 'pixi.js'
import { AABB } from './AABB'

export interface GeometryForCollision {
  createBound(): AABB
  applyPosition(pos: Vec2): GeometryForCollision
  draw(g: Graphics, pos: Vec2): void
}
