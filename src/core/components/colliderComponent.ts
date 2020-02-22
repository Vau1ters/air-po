import { Entity } from '../ecs/entity'
import { Vec2 } from '../math/vec2'
import { AABB } from '../math/aabb'

export class ColliderComponent {
  public constructor(
    public colliders = new Array<Collider>(),
    public entity: Entity
  ) {}
}

export class Collider {
  public constructor(
    public aabb: AABB,
    public offset = new Vec2(),
    public isSensor: boolean = false
  ) {}
}
