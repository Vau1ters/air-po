import { Entity } from '../ecs/entity'
import { Family } from '../ecs/family'
import { AABB } from '../math/aabb'
import { Vec2 } from '../math/vec2'
import { Circle } from '../math/circle'
import { assert } from '../../utils/assertion'

export interface Collider {
  component: ColliderComponent
  isSensor: boolean
  callback: ((me: Collider, other: Collider) => void) | null
  tag: string
  category: number
  mask: number
}

export class AABBCollider implements Collider {
  public constructor(
    public component: ColliderComponent,
    public aabb: AABB,
    public maxClipTolerance: Vec2,
    public isSensor: boolean,
    public callback: ((me: Collider, other: Collider) => void) | null,
    public tag: string,
    public category: number,
    public mask: number
  ) {}
}

export class CircleCollider implements Collider {
  public constructor(
    public component: ColliderComponent,
    public circle: Circle,
    public isSensor: boolean,
    public callback: ((me: Collider, other: Collider) => void) | null,
    public tag: string,
    public category: number,
    public mask: number
  ) {}
}

export class AirCollider implements Collider {
  public constructor(
    public component: ColliderComponent,
    public airFamily: Family,
    public isSensor: boolean,
    public callback: ((me: Collider, other: Collider) => void) | null,
    public tag: string,
    public category: number,
    public mask: number
  ) {}
}

export interface ColliderDef {
  isSensor: boolean
  callback: ((me: Collider, other: Collider) => void) | null
  tag: string
  category: number
  mask: number
}

export class AABBDef implements ColliderDef {
  public offset = new Vec2()
  public maxClipTolerance = new Vec2()
  public isSensor = false
  public callback: ((me: Collider, other: Collider) => void) | null = null
  public tag = ''
  public category = 0x0001
  public mask = 0xffff
  public constructor(public size: Vec2) {}
}

export class CircleDef implements ColliderDef {
  public offset = new Vec2()
  public isSensor = false
  public callback: ((me: Collider, other: Collider) => void) | null = null
  public tag = ''
  public category = 0x0001
  public mask = 0xffff
  public constructor(public radius: number) {}
}

export class AirDef implements ColliderDef {
  public isSensor = false
  public callback: ((me: Collider, other: Collider) => void) | null = null
  public tag = ''
  public category = 0x0001
  public mask = 0xffff
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
