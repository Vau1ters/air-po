import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { Graphics } from 'pixi.js'
import { AABB } from './AABB'
import { GeometryForCollision } from './geometry'

export class Air implements GeometryForCollision {
  public static readonly EFFECTIVE_RADIUS = 200

  public family: Family
  constructor(world: World) {
    this.family = new FamilyBuilder(world).include('Air').build()
  }

  createBound(): AABB {
    const big = 114514 // cannot use Infinity since coordinate of right edge become NaN (-Infinity + Infinity)
    return new AABB(new Vec2(), new Vec2(+big * 2, +big * 2))
  }

  applyPosition(): GeometryForCollision {
    return this
  }

  draw(_: Graphics, __: Vec2): void {}
}
