import { Entity } from '../ecs/entity'
import { Family } from '../ecs/family'
import { AABB } from '../math/aabb'
import { Vec2 } from '../math/vec2'
import { Circle } from '../math/circle'
import { assert } from '../../utils/assertion'
import { Category, CategorySet } from '../entities/category'

export interface Collider {
  component: ColliderComponent
  isSensor: boolean
  callback: ((me: Collider, other: Collider) => void) | null
  tag: Set<string>
  category: Category
  mask: CategorySet
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
    public tag: Set<string>,
    public category: Category,
    public mask: CategorySet
  ) {
    this.bound = aabb
  }
}

export class CircleCollider implements Collider {
  public bound: AABB

  public constructor(
    public component: ColliderComponent,
    public circle: Circle,
    public isSensor: boolean,
    public callback: ((me: Collider, other: Collider) => void) | null,
    public tag: Set<string>,
    public category: Category,
    public mask: CategorySet
  ) {
    this.bound = this.buildAABBBound()
  }

  public set radius(radius: number) {
    this.circle.radius = radius
    this.bound = this.buildAABBBound()
  }

  private buildAABBBound(): AABB {
    return new AABB(
      this.circle.position.sub(new Vec2(this.circle.radius, this.circle.radius)),
      new Vec2(this.circle.radius, this.circle.radius).mul(2)
    )
  }
}

export class AirCollider implements Collider {
  public bound: AABB

  public constructor(
    public component: ColliderComponent,
    public airFamily: Family,
    public isSensor: boolean,
    public callback: ((me: Collider, other: Collider) => void) | null,
    public tag: Set<string>,
    public category: Category,
    public mask: CategorySet
  ) {
    this.bound = new AABB()
  }
}

export interface ColliderDef {
  isSensor: boolean
  callback: ((me: Collider, other: Collider) => void) | null
  tag: Set<string>
  category: Category
  mask: Set<Category>
}

export class AABBDef implements ColliderDef {
  public offset = new Vec2()
  public maxClipTolerance = new Vec2()
  public isSensor = false
  public callback: ((me: Collider, other: Collider) => void) | null = null
  public tag: Set<string> = new Set()
  public category = Category.DEFAULT
  public mask = CategorySet.ALL
  public constructor(public size: Vec2) {}
}

export class CircleDef implements ColliderDef {
  public offset = new Vec2()
  public isSensor = false
  public callback: ((me: Collider, other: Collider) => void) | null = null
  public tag: Set<string> = new Set()
  public category = Category.DEFAULT
  public mask = CategorySet.ALL
  public constructor(public radius: number) {}
}

export class AirDef implements ColliderDef {
  public isSensor = false
  public callback: ((me: Collider, other: Collider) => void) | null = null
  public tag: Set<string> = new Set()
  public category = Category.DEFAULT
  public mask = new CategorySet(Category.PLAYER)
  public constructor(public airFamily: Family) {}
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
    } else if (def instanceof CircleDef) {
      const collider = new CircleCollider(
        this,
        new Circle(def.offset, def.radius),
        def.isSensor,
        def.callback,
        def.tag,
        def.category,
        def.mask
      )
      this.colliders.push(collider)
    } else if (def instanceof AirDef) {
      const collider = new AirCollider(
        this,
        def.airFamily,
        def.isSensor,
        def.callback,
        def.tag,
        def.category,
        def.mask
      )
      this.colliders.push(collider)
    } else {
      assert(false)
    }
  }
}
