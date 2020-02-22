import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { ColliderComponent, Collider } from '../components/colliderComponent'

export default class PhysicsSystem extends System {
  private family: Family

  private collidedList: Array<[Collider, Collider]> = []

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world)
      .include('Position', 'RigidBody', 'Collider')
      .build()
  }

  public update(delta: number): void {
    this.collidedList.length = 0
    this.broadPhase([...this.family.entities])
    this.solve(this.collidedList)
    for (const entity of this.family.entities) {
      const position = entity.getComponent('Position') as PositionComponent
      const body = entity.getComponent('RigidBody') as RigidBodyComponent
      body.velocity.x += body.acceleration.x * delta
      body.velocity.y += body.acceleration.y * delta
      position.x += body.velocity.x * delta
      position.y += body.velocity.y * delta
      body.acceleration.x = body.acceleration.y = 0
    }
  }

  // BroadPhase
  // 衝突したものをlistに打ち込む
  private broadPhase(entities: Array<Entity>): void {
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entity1 = entities[i]
        const entity2 = entities[j]
        this.collide(entity1, entity2)
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
        const aabb1 = c1.aabb.add(position1)
        const aabb2 = c2.aabb.add(position2)
        if (aabb1.overlap(aabb2)) {
          switch (c1.isSensor || c2.isSensor) {
            case false:
              this.collidedList.push([c1, c2])
              break
            default:
              // センサー用のcallbackとかに衝突情報渡したい
              break
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
      const aabb1 = c1.aabb.add(position1)
      const aabb2 = c2.aabb.add(position2)

      const center1 = aabb1.center
      const center2 = aabb2.center

      const diff = center1.sub(center2)

      const ratio =
        (aabb1.size.y + aabb2.size.y) / (aabb1.size.x + aabb2.size.x)

      // バネ係数
      const k = 10
      const sumMass = body1.invMass + body2.invMass
      // 反発係数
      const rest = 1 + body1.restitution * body2.restitution
      // 中心座標の位置関係を見てどっちに押し出すか決める
      if (Math.abs(diff.y / diff.x) > ratio) {
        // 縦方向押し出し
        body1.acceleration.y += diff.y * k * (body1.invMass / sumMass) * rest
        body2.acceleration.y += -diff.y * k * (body2.invMass / sumMass) * rest
      } else {
        // 横方向押し出し
        body1.acceleration.x += diff.x * k * (body1.invMass / sumMass) * rest
        body2.acceleration.x += -diff.x * k * (body2.invMass / sumMass) * rest
      }
    }
  }
}