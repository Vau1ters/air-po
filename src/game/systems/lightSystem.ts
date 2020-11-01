import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder, Family } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Collider } from '@game/components/colliderComponent'
import { Category } from '@game/entities/category'

export class LightSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Light').build()

    this.family.entityAddedEvent.addObserver((e: Entity) => {
      for (const c of e
        .getComponent('Collider')
        .colliders.filter(c => c.category === Category.SENSOR)) {
        c.callbacks.add(LightSystem.lightAirCollision)
      }
    })
    this.family.entityAddedEvent.removeObserver((e: Entity) => {
      for (const c of e
        .getComponent('Collider')
        .colliders.filter(c => c.category === Category.SENSOR)) {
        c.callbacks.delete(LightSystem.lightAirCollision)
      }
    })
  }

  public update(): void {
    for (const light of this.family.entityIterator) {
      light.getComponent('Light').intensity = 0
    }
  }

  private static lightAirCollision(me: Collider, other: Collider): void {
    if (!other.tag.has('air')) return
    me.entity.getComponent('Light').intensity = 1
  }
}
