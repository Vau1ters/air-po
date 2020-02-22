import { Entity } from '../ecs/entity'
import { AABB } from '../math/aabb'
import { Vec2 } from '../math/vec2'

export class Collider {
  public constructor(
    public component: ColliderComponent,
    public aabb: AABB,
    public isSensor: boolean
  ) {}
}

export class ColliderComponent {
  public colliders = new Array<Collider>()
  public constructor(public entity: Entity) {}

  public createAABB(size: Vec2, offset = new Vec2(), isSensor = false): void {
    const collider = new Collider(this, new AABB(offset, size), isSensor)
    this.colliders.push(collider)
  }
}
