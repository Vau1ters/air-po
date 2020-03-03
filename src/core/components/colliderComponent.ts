import { Entity } from '../ecs/entity'
import { AABB } from '../math/aabb'
import { Vec2 } from '../math/vec2'

export class Collider {
  public constructor(
    public component: ColliderComponent,
    public aabb: AABB,
    public isSensor: boolean,
    public callback: ((me: Collider, other: Collider) => void) | null,
    public tag: string,
    public category: number,
    public mask: number
  ) {}
}

export class ColliderComponent {
  public colliders = new Array<Collider>()
  public constructor(public entity: Entity) {}

  public createAABB(
    size: Vec2,
    offset = new Vec2(),
    isSensor = false,
    callback: ((me: Collider, other: Collider) => void) | null = null,
    tag = '',
    category = 0x0001,
    mask = 0xffff
  ): void {
    const collider = new Collider(
      this,
      new AABB(offset, size),
      isSensor,
      callback,
      tag,
      category,
      mask
    )
    this.colliders.push(collider)
  }
}
