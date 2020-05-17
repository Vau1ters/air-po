import { Entity } from '../ecs/entity'
import { AABB } from '../math/aabb'
import { Vec2 } from '../math/vec2'
import { Category, CategorySet } from '../entities/category'

export interface Collider {
  component: ColliderComponent
  isSensor: boolean
  callback: ((me: Collider, other: Collider) => void) | null
  tag: string
  category: Category
  mask: Set<Category>
  bound: AABB
}

export class AABBCollider implements Collider {
  public bound: AABB

  public constructor(
    public component: ColliderComponent,
    public aabb: AABB,
    public maxClipTolerance: Vec2,
    public isSensor: boolean,
    public callback: ((me: Collider, other: Collider) => void) | null,
    public tag: string,
    public category: Category,
    public mask: Set<Category>
  ) {
    this.bound = aabb
  }
}

export interface ColliderDef {
  isSensor: boolean
  callback: ((me: Collider, other: Collider) => void) | null
  tag: string
  category: Category
  mask: Set<Category>
}

export class AABBDef implements ColliderDef {
  public offset = new Vec2()
  public maxClipTolerance = new Vec2()
  public isSensor = false
  public callback: ((me: Collider, other: Collider) => void) | null = null
  public tag = ''
  public category = Category.DEFAULT
  public mask = CategorySet.ALL
  public constructor(public size: Vec2) {}
}

export class ColliderComponent {
  public readonly colliders = new Array<Collider>()
  public constructor(public entity: Entity) {}

  public createCollider(def: ColliderDef): void {
    if (def instanceof AABBDef) {
      const collider = new AABBCollider(
        this,
        new AABB(def.offset, def.size),
        def.maxClipTolerance,
        def.isSensor,
        def.callback,
        def.tag,
        def.category,
        def.mask
      )
      this.colliders.push(collider)
    }
  }
}
