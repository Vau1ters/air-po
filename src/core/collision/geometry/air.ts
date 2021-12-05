import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { INFINITY_COORDINATE } from '@core/math/constants'
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
    return new AABB(new Vec2(), new Vec2(INFINITY_COORDINATE, INFINITY_COORDINATE))
  }

  applyPosition(): GeometryForCollision {
    return this
  }

  draw(_: Graphics): void {}

  solvable(): boolean {
    return false
  }
}
