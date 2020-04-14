import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { TamaComponent } from '../components/tamaComponent'
import { PositionComponent } from '../components/positionComponent'
import { Collider } from '../components/colliderComponent'

export class TamaSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world)
      .include('Tama', 'Collider', 'Position')
      .build()
    this.family.entityAddedEvent.addObserver(entity => this.entityAdded(entity))
  }

  private entityAdded(entity: Entity): void {
    const collider = entity.getComponent('Collider')
    if (collider) {
      for (const c of collider.colliders) {
        c.callback = (tama): void => this.tamaSensor(tama)
      }
    }
  }

  public update(): void {
    for (const entity of this.family.entities) {
      const tama = entity.getComponent('Tama') as TamaComponent
      if (!tama) continue
      const pos = entity.getComponent('Position') as PositionComponent
      pos.x += tama.speed.x
      pos.y += tama.speed.y

      if (pos.x < 0 || pos.x > 320) {
        this.world.removeEntity(entity)
      }
    }
  }

  private tamaSensor(tama: Collider): void {
    const tc = tama.component.entity.getComponent('Tama')
    if (tc) {
      this.world.removeEntity(tama.component.entity)
    }
  }
}
