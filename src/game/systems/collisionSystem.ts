import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Collider } from '@game/components/colliderComponent'
import { collide } from '@core/collision/collision'
import { Category, CategorySet } from '@game/entities/category'
import { assert } from '@utils/assertion'
import { BVH } from '@core/collision/bvh'
import { AABB } from '@core/collision/geometry/AABB'

export default class CollisionSystem extends System {
  private staticFamily: Family
  private dynamicFamily: Family
  private staticBVHs = new Map<Category, BVH>()
  private dynamicBVHs = new Map<Category, BVH>()
  private needsStaticInitialize = true

  public constructor(world: World) {
    super(world)

    this.staticFamily = new FamilyBuilder(world)
      .include('Collider')
      .include('Static')
      .build()
    this.dynamicFamily = new FamilyBuilder(world)
      .include('Collider')
      .exclude('Static')
      .build()
  }

  public init(): void {
    for (const c of CategorySet.ALL) {
      this.staticBVHs.set(c, new BVH())
      this.dynamicBVHs.set(c, new BVH())
    }
    this.needsStaticInitialize = true
  }

  public update(): void {
    if (this.needsStaticInitialize) {
      this.needsStaticInitialize = false
      this.buildBVH(this.staticFamily, this.staticBVHs)
    }
    this.buildBVH(this.dynamicFamily, this.dynamicBVHs)
    this.broadPhase()
  }

  private buildBVH(family: Family, bvhs: Map<Category, BVH>): void {
    const colliderMap = new Map<Category, Collider[]>()
    for (const c of CategorySet.ALL) {
      colliderMap.set(c, [])
    }
    for (const e of family.entityIterator) {
      for (const c of e.getComponent('Collider').colliders) {
        const colliders = colliderMap.get(c.category)
        assert(colliders, `There are no collider with category '${c.category}'`)
        colliders.push(c)
      }
    }
    for (const [category, bvh] of bvhs) {
      const colliders = colliderMap.get(category)
      assert(colliders, `There are no collider with category '${category}'`)
      bvh.build(colliders)
    }
  }

  private broadPhase(): void {
    for (const entity1 of this.dynamicFamily.entityIterator) {
      const collider1 = entity1.getComponent('Collider')
      const position1 = entity1.getComponent('Position')

      const collidedEntityIdSet = new Set<number>()
      for (const c of collider1.colliders) {
        for (const m of c.mask) {
          const rs = this.query(m, c.bound.add(position1))
          for (const { entity: entity2 } of rs) {
            if (entity1 === entity2) continue // prevent self collision
            if (collidedEntityIdSet.has(entity2.id)) continue // prevent dual collision
            collidedEntityIdSet.add(entity2.id)
            this.collide(entity1, entity2)
          }
        }
      }
    }
  }

  private query(category: Category, bound: AABB): Collider[] {
    const staticResult = this.staticBVHs.get(category)?.query(bound)
    const dynamicResult = this.dynamicBVHs.get(category)?.query(bound)
    assert(staticResult !== undefined, `There are no BVH with category '${category}'`)
    assert(dynamicResult !== undefined, `There are no BVH with category '${category}'`)
    return staticResult.concat(dynamicResult)
  }

  // 衝突判定
  private collide(entity1: Entity, entity2: Entity): void {
    const position1 = entity1.getComponent('Position')
    const position2 = entity2.getComponent('Position')
    const colliders1 = entity1.getComponent('Collider')
    const colliders2 = entity2.getComponent('Collider')

    for (const c1 of colliders1.colliders) {
      for (const c2 of colliders2.colliders) {
        const { mask: mask1, category: category1 } = c1
        const { mask: mask2, category: category2 } = c2
        if (!c1.condition(c1, c2) || !c2.condition(c2, c1)) continue

        const result = collide(c1, c2, position1, position2)
        if (result.hit === false) continue
        if (mask1.has(category2)) {
          for (const callback of c1.callbacks) {
            callback({ me: c1, other: c2, ...result })
          }
        }
        if (mask2.has(category1)) {
          for (const callback of c2.callbacks) {
            callback({ me: c2, other: c1, ...result })
          }
        }
      }
    }
  }

  public get bvhs(): IterableIterator<BVH> {
    const { staticBVHs, dynamicBVHs } = this
    return (function*(): Generator<BVH> {
      for (const [_, bvh] of staticBVHs) yield bvh
      for (const [_, bvh] of dynamicBVHs) yield bvh
    })()
  }
}
