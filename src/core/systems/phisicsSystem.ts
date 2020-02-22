import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/positionComponent'
import { VelocityComponent } from '../components/velocityComponent'
import { ColliderComponent } from '../components/colliderComponent'
import { Collider } from '../components/colliderComponent'

export default class PhysicsSystem extends System {
  private family: Family

  private collidedList: Array<[Collider, Collider]> = []

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world)
      .include('Position', 'Velocity', 'Collider')
      .build()
  }

  public update(delta: number): void {
    this.broadPhase([...this.family.entities])
    for (const entity of this.family.entities) {
      const position = entity.getComponent('Position') as PositionComponent
      const velocity = entity.getComponent('Velocity') as VelocityComponent
      position.x += velocity.x * delta
      position.y += velocity.y * delta
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
    const colliders1 = entity1.getComponent('Collider') as ColliderComponent
    const colliders2 = entity2.getComponent('Collider') as ColliderComponent

    for (const c1 of colliders1.colliders) {
      for (const c2 of colliders2.colliders) {
        if (c1.aabb.overlap(c2.aabb)) {
          switch ([c1.isSensor, c2.isSensor]) {
            case [false, false]:
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

  private solve(): void {
    // 互いに押し合う
  }
}
