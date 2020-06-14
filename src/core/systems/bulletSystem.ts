import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { Collider } from '../components/colliderComponent'

export class BulletSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Bullet', 'Collider', 'Position').build()
    this.family.entityAddedEvent.addObserver(entity => this.entityAdded(entity))
  }

  private entityAdded(entity: Entity): void {
    const collider = entity.getComponent('Collider')
    if (collider) {
      for (const c of collider.colliders) {
        if (c.tag.has('bulletBody')) {
          c.callback = (bullet): void => this.bulletCollisionCallback(bullet)
        }
      }
    }
  }

  public update(): void {
    for (const entity of this.family.entityIterator) {
      const bullet = entity.getComponent('Bullet')
      const pos = entity.getComponent('Position')
      pos.x += bullet.speed.x
      pos.y += bullet.speed.y

      if (bullet.life-- < 0) {
        this.world.removeEntity(entity)
      }
    }
  }

  private bulletCollisionCallback(bullet: Collider): void {
    if (bullet.component.entity.hasComponent('Bullet')) {
      this.world.removeEntity(bullet.component.entity)
    }
  }
}
