import { CollisionResult } from '@core/collision/collision'
import { AABB } from '@core/collision/geometry/AABB'
import { Air } from '@core/collision/geometry/air'
import { GeometryForCollision } from '@core/collision/geometry/geometry'
import { OBB } from '@core/collision/geometry/OBB'
import { Segment } from '@core/collision/geometry/segment'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { Category } from '@game/entities/category'

export type CollisionCondition = (me: Collider, other: Collider) => boolean
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

  get condition(): CollisionCondition {
    return this.option.condition
  }

  set condition(condition: CollisionCondition) {
    this.option.condition = condition
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
  condition: CollisionCondition
  callbacks: Set<CollisionCallback>
  tag: Set<string>
  category: Category
  mask: Set<Category>
}

export type GeometryBuildOption =
  | {
      type: 'AABB'
      offset?: Vec2
      size?: Vec2
      maxClipToTolerance?: Vec2
    }
  | {
      type: 'OBB'
      offset?: Vec2
      size?: Vec2
      angle?: number
    }
  | {
      type: 'Segment'
      start?: Vec2
      end?: Vec2
    }
  | {
      type: 'Air'
      world: World
    }

export type ColliderBuildOption = {
  condition?: CollisionCondition
  callbacks?: CollisionCallback[]
  tag?: string[]
  category: Category
  mask?: Set<Category>
  geometry: GeometryBuildOption
}

const buildGeometry = (option: GeometryBuildOption): GeometryForCollision => {
  switch (option.type) {
    case 'AABB':
      return new AABB(option.offset, option.size, option.maxClipToTolerance)
    case 'OBB':
      return new OBB(new AABB(option.offset, option.size), option.angle)
    case 'Segment':
      return new Segment(option.start, option.end)
    case 'Air':
      return new Air(option.world)
  }
}

export const buildCollider = (option: { entity: Entity } & ColliderBuildOption): Collider => {
  const geometry = buildGeometry(option.geometry)
  return new Collider(option.entity, geometry.createBound(), geometry, {
    condition: option.condition ?? ((): boolean => true),
    callbacks: new Set<CollisionCallback>(option.callbacks),
    tag: new Set<string>(option.tag),
    category: option.category,
    mask: option.mask ?? new Set<Category>(),
  })
}

export const buildColliders = (options: {
  entity: Entity
  colliders: ColliderBuildOption[]
}): Collider[] =>
  options.colliders.map((option: ColliderBuildOption) =>
    buildCollider({ entity: options.entity, ...option })
  )

export class ColliderComponent {
  public readonly colliders: Array<Collider>

  constructor(...colliders: Array<Collider>) {
    this.colliders = colliders
  }

  public getByCategory(category: Category): Collider | undefined {
    return this.colliders.find(c => c.option.category === category)
  }

  public removeByTag(tag: string): void {
    while (true) {
      const idx = this.colliders.findIndex(c => c.option.tag.has(tag))
      if (idx === -1) return
      this.colliders.splice(idx, 1)
    }
  }
}
