import { Entity } from '@core/ecs/entity'
import { Category } from '../entities/category'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { AirFilter } from '@game/filters/airFilter'
import { AABB } from '@core/collision/aabb'
import { Circle } from '@core/collision/circle'
import { Ray } from '@core/collision/ray'
import { assert } from '@utils/assertion'
import { Graphics } from 'pixi.js'
import { CollisionResult, CollisionResultHit } from '@core/collision/collision'

export type ShouldCollide = (me: Collider, other: Collider) => boolean
export type CollisionCallbackArgs = Exclude<CollisionResult, CollisionResultHit> & {
  me: Collider
  other: Collider
}
export type CollisionCallback = (args: CollisionCallbackArgs) => void

export class Collider {
  constructor(
    public entity: Entity,
    public bound: AABB,
    public geometry: GeometryForCollision,
    public option: ColliderOption
  ) {}

  get isSensor(): boolean {
    return this.option.isSensor
  }

  get shouldCollide(): ShouldCollide {
    return this.option.shouldCollide
  }

  get callbacks(): Set<CollisionCallback> {
    return this.option.callbacks
  }

  get tag(): Set<string> {
    return this.option.tag
  }

  get category(): Category {
    return this.option.category
  }

  get mask(): Set<Category> {
    return this.option.mask
  }
}

export type ColliderOption = {
  isSensor: boolean
  shouldCollide: ShouldCollide
  callbacks: Set<CollisionCallback>
  tag: Set<string>
  category: Category
  mask: Set<Category>
}

export interface GeometryForCollision {
  createBound(): AABB
  applyPosition(pos: Vec2): GeometryForCollision
  draw(g: Graphics, pos: Vec2): void
}

export class AABBForCollision implements GeometryForCollision {
  constructor(public bound: AABB, public maxClipToTolerance: Vec2 = new Vec2(0, 0)) {}

  createBound(): AABB {
    return this.bound
  }

  applyPosition(pos: Vec2): AABBForCollision {
    return new AABBForCollision(this.bound.add(pos), this.maxClipToTolerance)
  }

  draw(g: Graphics, position: Vec2): void {
    const pos = position.add(this.bound.position)
    g.drawRect(pos.x, pos.y, this.bound.size.x, this.bound.size.y)
  }
}

export class CircleForCollision implements GeometryForCollision {
  constructor(public circle: Circle) {}

  createBound(): AABB {
    return this.circle.createBound()
  }

  applyPosition(pos: Vec2): CircleForCollision {
    return new CircleForCollision(this.circle.add(pos))
  }

  draw(g: Graphics, position: Vec2): void {
    const pos = position.add(this.circle.position)
    g.drawCircle(pos.x, pos.y, this.circle.radius)
  }
}

export class AirForCollision implements GeometryForCollision {
  public family: Family
  constructor(world: World) {
    this.family = new FamilyBuilder(world).include('Air').build()
  }

  createBound(): AABB {
    const aabbBounds: AABB[] = this.family.entityArray.map((e: Entity) => {
      const p = e.getComponent('Position')
      return new AABB(
        p.sub(new Vec2(AirFilter.EFFECTIVE_RADIUS, AirFilter.EFFECTIVE_RADIUS)),
        new Vec2(AirFilter.EFFECTIVE_RADIUS * 2, AirFilter.EFFECTIVE_RADIUS * 2)
      )
    })
    if (aabbBounds.length === 0) return new AABB()
    return aabbBounds.reduce((a, b) => a.merge(b))
  }

  applyPosition(): GeometryForCollision {
    return this
  }

  draw(_: Graphics, __: Vec2): void {}
}

export class RayForCollision implements GeometryForCollision {
  constructor(public ray: Ray) {}

  createBound(): AABB {
    const big = 114514 // cannot use Infinity since coordinate of right edge become NaN (-Infinity + Infinity)
    return new AABB(new Vec2(-big, -big), new Vec2(+big * 2, +big * 2))
  }

  applyPosition(pos: Vec2): GeometryForCollision {
    return new RayForCollision(new Ray(pos.add(this.ray.origin), this.ray.direction))
  }

  draw(_: Graphics, __: Vec2): void {}
}

export class ColliderBuilder {
  private entity?: Entity
  private geometry?: GeometryForCollision
  private option: Partial<ColliderOption> = {
    isSensor: false,
    shouldCollide: () => true,
    callbacks: new Set<CollisionCallback>(),
    tag: new Set<string>(),
    category: undefined,
    mask: new Set<Category>(),
  }

  setEntity(entity: Entity): ColliderBuilder {
    this.entity = entity
    return this
  }

  setGeometry(geometry: GeometryForCollision): ColliderBuilder {
    this.geometry = geometry
    return this
  }

  setAABB(arg: { offset?: Vec2; size: Vec2; maxClipToTolerance?: Vec2 }): ColliderBuilder {
    return this.setGeometry(
      new AABBForCollision(new AABB(arg.offset, arg.size), arg.maxClipToTolerance)
    )
  }

  setAir(world: World): ColliderBuilder {
    return this.setGeometry(new AirForCollision(world))
  }

  setRay(arg: { offset?: Vec2; direction: Vec2 }): ColliderBuilder {
    return this.setGeometry(new RayForCollision(new Ray(arg.offset, arg.direction)))
  }

  setIsSensor(isSensor: boolean): ColliderBuilder {
    this.option.isSensor = isSensor
    return this
  }

  setShouldCollide(shouldCollide: ShouldCollide): ColliderBuilder {
    this.option.shouldCollide = shouldCollide
    return this
  }

  addCallback(callback: CollisionCallback): ColliderBuilder {
    this.option.callbacks?.add(callback)
    return this
  }

  addTag(tag: string): ColliderBuilder {
    this.option.tag?.add(tag)
    return this
  }

  setCategory(arg: { category: Category; mask: Set<Category> }): ColliderBuilder {
    this.option.category = arg.category
    this.option.mask = arg.mask
    return this
  }

  build(): Collider {
    assert(this.entity !== undefined, 'entity is not set')
    assert(this.geometry !== undefined, 'geometry is not set')
    assert(this.option.isSensor !== undefined, 'isSensor is not set')
    assert(this.option.shouldCollide !== undefined, 'shouldCollide is not set')
    assert(this.option.callbacks !== undefined, 'callbacks is not set')
    assert(this.option.tag !== undefined, 'tag is not set')
    assert(this.option.category !== undefined, 'category is not set')
    assert(this.option.mask !== undefined, 'mask is not set')
    return new Collider(this.entity, this.geometry.createBound(), this.geometry, {
      isSensor: this.option.isSensor,
      shouldCollide: this.option.shouldCollide,
      callbacks: this.option.callbacks,
      tag: this.option.tag,
      category: this.option.category,
      mask: this.option.mask,
    })
  }
}

export class ColliderComponent {
  public readonly colliders = new Array<Collider>()

  public removeByTag(tag: string): void {
    while (true) {
      const idx = this.colliders.findIndex(c => c.option.tag.has(tag))
      if (idx === -1) return
      this.colliders.splice(idx, 1)
    }
  }
}
