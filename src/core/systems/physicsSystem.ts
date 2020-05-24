import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import {
  ColliderComponent,
  Collider,
  AABBCollider,
} from '../components/colliderComponent'
import { collide } from '../physics/collision'
import { BVHComponent } from '../components/bvhComponent'
import { Category, CategorySet } from '../entities/category'
import { assert } from '../../utils/assertion'

export default class PhysicsSystem extends System {
  private colliderFamily: Family
  private rigidBodyFamily: Family
  private bvhFamily: Family

  private collidedList: Array<[Collider, Collider]> = []

  public constructor(world: World) {
    super(world)

    this.colliderFamily = new FamilyBuilder(world)
      .include('Position', 'Collider')
      .build()
    this.rigidBodyFamily = new FamilyBuilder(world)
      .include('Position', 'RigidBody')
      .build()
    this.bvhFamily = new FamilyBuilder(world).include('BVH').build()

    for (const c of CategorySet.ALL) {
      const e = new Entity()
      const bvh = new BVHComponent(c)
      e.addComponent('BVH', bvh)
      this.world.addEntity(e)
    }
  }

  public buildBVH(): void {
    const entities = [...this.colliderFamily.entities]
    const colliderMap = new Map<Category, Collider[]>()
    for (const c of CategorySet.ALL) {
      colliderMap.set(c, [])
    }
    for (const e of entities) {
      const cs = (e.getComponent('Collider') as ColliderComponent).colliders
      for (const c of cs) {
        const colliders = colliderMap.get(c.category)
        assert(colliders)
        colliders.push(c)
      }
    }
    const bvhs = Array.from(this.bvhFamily.entities).map(
      e => e.getComponent('BVH') as BVHComponent
    )
    for (const bvh of bvhs) {
      if (bvh.category === Category.WALL && bvh.root) continue
      const colliders = colliderMap.get(bvh.category)
      assert(colliders)
      bvh.build(colliders)
    }
  }

  public update(delta: number): void {
    this.buildBVH()
    this.collidedList.length = 0
    this.broadPhase([...this.colliderFamily.entities])
    this.solve(this.collidedList)
    for (const entity of this.rigidBodyFamily.entities) {
      const position = entity.getComponent('Position') as PositionComponent
      const body = entity.getComponent('RigidBody') as RigidBodyComponent
      body.velocity.x += body.acceleration.x * delta
      body.velocity.y += body.acceleration.y * delta
      position.x += body.velocity.x * delta
      position.y += body.velocity.y * delta
      body.acceleration.x = body.acceleration.y = 0
    }
  }

  private broadPhase(entities: Array<Entity>): void {
    const bvhs: { [key: string]: BVHComponent } = {}
    for (const entity of this.bvhFamily.entities) {
      const bvh = entity.getComponent('BVH') as BVHComponent
      bvhs[bvh.category] = bvh
    }
    for (const entity1 of entities) {
      const collider1 = entity1.getComponent('Collider') as ColliderComponent
      const position1 = entity1.getComponent('Position') as PositionComponent

      let candidates: Collider[] = []
      for (const c of collider1.colliders) {
        for (const m of c.mask) {
          const bvh = bvhs[m]
          assert(bvh)
          const rs = bvh.query(c.bound.add(position1))
          for (const r of rs) {
            candidates.push(r)
          }
        }
      }
      candidates = candidates
        .filter(
          // remove duplicated candidates
          (elem, index, self) =>
            self.findIndex(
              elem2 => elem2.component.entity.id === elem.component.entity.id
            ) === index
        )
        .filter(elem => elem.component.entity !== entity1) // remove itself
      for (const collider2 of candidates) {
        this.collide(entity1, collider2.component.entity)
      }
    }
  }

  // 衝突判定
  private collide(entity1: Entity, entity2: Entity): void {
    const position1 = entity1.getComponent('Position') as PositionComponent
    const position2 = entity2.getComponent('Position') as PositionComponent
    const colliders1 = entity1.getComponent('Collider') as ColliderComponent
    const colliders2 = entity2.getComponent('Collider') as ColliderComponent

    for (const c1 of colliders1.colliders) {
      for (const c2 of colliders2.colliders) {
        const mask1 = c1.mask
        const category1 = c1.category
        const mask2 = c2.mask
        const category2 = c2.category
        if (!mask1.has(category2) || !mask2.has(category1)) continue

        if (collide(c1, c2, position1, position2)) {
          if (
            !(c1.isSensor || c2.isSensor) &&
            entity1.hasComponent('RigidBody') &&
            entity2.hasComponent('RigidBody')
          ) {
            this.collidedList.push([c1, c2])
          }
          if (c1.callback) {
            c1.callback(c1, c2)
          }
          if (c2.callback) {
            c2.callback(c2, c1)
          }
        }
      }
    }
  }

  private solve(collidedList: Array<[Collider, Collider]>): void {
    // 互いに押し合う
    for (const [c1, c2] of collidedList) {
      const body1 = c1.component.entity.getComponent(
        'RigidBody'
      ) as RigidBodyComponent
      const body2 = c2.component.entity.getComponent(
        'RigidBody'
      ) as RigidBodyComponent

      const position1 = c1.component.entity.getComponent(
        'Position'
      ) as PositionComponent
      const position2 = c2.component.entity.getComponent(
        'Position'
      ) as PositionComponent
      // TODO:別クラスに分ける
      if (c1 instanceof AABBCollider && c2 instanceof AABBCollider) {
        const aabb1 = c1.aabb.add(position1)
        const aabb2 = c2.aabb.add(position2)

        const center1 = aabb1.center
        const center2 = aabb2.center

        const pDiff = center1.sub(center2)
        const vDiff = body1.velocity.sub(body2.velocity)

        const clip = aabb1.size
          .add(aabb2.size)
          .div(2)
          .sub(pDiff.abs())

        if (clip.x < 0 || clip.y < 0) {
          // すでに衝突は解消されている
          continue
        }

        const ratio =
          (aabb1.size.y + aabb2.size.y) / (aabb1.size.x + aabb2.size.x)

        const sumMass = body1.invMass + body2.invMass
        // 反発係数
        const rest = 1 + body1.restitution * body2.restitution
        // 中心座標の位置関係を見て押し出す向きを決める
        if (Math.abs(pDiff.y / pDiff.x) > ratio) {
          // 縦方向
          // 離れようとしているときに押し出さないようにする
          if (vDiff.y * pDiff.y <= 0) {
            body1.velocity.y += -vDiff.y * (body1.invMass / sumMass) * rest
            body2.velocity.y += vDiff.y * (body2.invMass / sumMass) * rest
          }
          // 押し出し
          let sign = 1
          if (pDiff.y > 0) sign = -1
          position1.y += sign * -clip.y * (body1.invMass / sumMass)
          position2.y += sign * clip.y * (body2.invMass / sumMass)
        } else {
          // 横方向
          // 離れようとしているときに押し出さないようにする
          if (vDiff.x * pDiff.x <= 0) {
            body1.velocity.x += -vDiff.x * (body1.invMass / sumMass) * rest
            body2.velocity.x += vDiff.x * (body2.invMass / sumMass) * rest
          }
          // 押し出し
          let sign = 1
          if (pDiff.x > 0) sign = -1
          position1.x += sign * -clip.x * (body1.invMass / sumMass)
          position2.x += sign * clip.x * (body2.invMass / sumMass)
        }
      }
    }
  }
}
