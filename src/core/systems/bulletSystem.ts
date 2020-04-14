import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { BulletComponent } from '../components/bulletComponent'
import { PositionComponent } from '../components/positionComponent'
import { Collider } from '../components/colliderComponent'

export class BulletSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world)
      .include('Bullet', 'Collider', 'Position')
      .build()
    this.family.entityAddedEvent.addObserver(entity => this.entityAdded(entity))
  }

  private entityAdded(entity: Entity): void {
    const collider = entity.getComponent('Collider')
    if (collider) {
      for (const c of collider.colliders) {
        c.callback = (bullet): void => this.bulletCollisionCallback(bullet)
      }
    }
  }

  public update(): void {
    for (const entity of this.family.entities) {
      const bullet = entity.getComponent('Bullet') as BulletComponent
      const pos = entity.getComponent('Position') as PositionComponent
      pos.x += bullet.speed.x
      pos.y += bullet.speed.y

      if (bullet.life-- < 0) {
        this.world.removeEntity(entity)
      }
    }
  }

  private bulletCollisionCallback(bullet: Collider): void {
    const tc = bullet.component.entity.getComponent('Bullet')
    if (tc) {
      this.world.removeEntity(bullet.component.entity)
    }
  }
}
