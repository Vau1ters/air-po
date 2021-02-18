import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Collider } from '@game/components/colliderComponent'
import { collide } from '@core/collision/collision'
import { Category, CategorySet } from '@game/entities/category'
import { assert } from '@utils/assertion'
import { BVH } from '@core/collision/bvh'

export default class CollisionSystem extends System {
  private family: Family
  public bvhs = new Map<Category, BVH>()

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Position', 'Collider').build()
  }

  public init(): void {
    for (const c of CategorySet.ALL) {
      const bvh = new BVH()
      this.bvhs.set(c, bvh)
    }
  }

  public update(): void {
    this.buildBVH()
    this.broadPhase()
  }

  private buildBVH(): void {
    const colliderMap = new Map<Category, Collider[]>()
    for (const c of CategorySet.ALL) {
      colliderMap.set(c, [])
    }
    for (const e of this.family.entityIterator) {
      const cs = e.getComponent('Collider').colliders
      for (const c of cs) {
        const colliders = colliderMap.get(c.category)
        assert(colliders, `There are no collider with category '${c.category}'`)
        colliders.push(c)
      }
    }
    for (const [category, bvh] of this.bvhs) {
      if (category === Category.STATIC_WALL && bvh.root) continue
      const colliders = colliderMap.get(category)
      assert(colliders, `There are no collider with category '${category}'`)
      bvh.build(colliders)
    }
  }

  private broadPhase(): void {
    for (const entity1 of this.family.entityIterator) {
      const collider1 = entity1.getComponent('Collider')
      const position1 = entity1.getComponent('Position')

      const collidedEntityIdSet = new Set<number>()
      for (const c of collider1.colliders) {
        if (c.category === Category.STATIC_WALL) continue // for performance
        for (const m of c.mask) {
          const bvh = this.bvhs.get(m)
          assert(bvh, `There are no BVH with category '${m}'`)
          const rs = bvh.query(c.bound.add(position1))
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
        if (!mask1.has(category2) || !mask2.has(category1)) continue
        if (!c1.shouldCollide(c1, c2) || !c2.shouldCollide(c2, c1)) continue

        const result = collide(c1, c2, position1, position2)
        if (result.hit === false) continue
        for (const callback of c1.callbacks) {
          callback(c1, c2, result)
        }
        for (const callback of c2.callbacks) {
          callback(c2, c1, result)
        }
      }
    }
  }
}
