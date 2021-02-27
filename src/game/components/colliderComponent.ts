import { CollisionResult } from '@core/collision/collision'
import { AABB } from '@core/collision/geometry/aabb'
import { Air } from '@core/collision/geometry/air'
import { GeometryForCollision } from '@core/collision/geometry/geometry'
import { OBB } from '@core/collision/geometry/obb'
import { Ray } from '@core/collision/geometry/ray'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { Category } from '@game/entities/category'
import { assert } from '@utils/assertion'

export type ShouldCollide = (me: Collider, other: Collider) => boolean
export type CollisionCallbackArgs = CollisionResult & {
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

  setAABB(arg: { offset?: Vec2; size?: Vec2; maxClipToTolerance?: Vec2 }): ColliderBuilder {
    return this.setGeometry(new AABB(arg.offset, arg.size, arg.maxClipToTolerance))
  }

  setOBB(arg: { offset?: Vec2; size: Vec2 }): ColliderBuilder {
    return this.setGeometry(new OBB(new AABB(arg.offset, arg.size), 0))
  }

  setAir(world: World): ColliderBuilder {
    return this.setGeometry(new Air(world))
  }

  setRay(arg: { offset?: Vec2; direction?: Vec2 }): ColliderBuilder {
    return this.setGeometry(new Ray(arg.offset, arg.direction))
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
