import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { FamilyBuilder, Family } from '../ecs/family'
import { World } from '../ecs/world'
import { Collider } from '../components/colliderComponent'

export class LightSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Light').build()

    this.family.entityAddedEvent.addObserver((e: Entity) => {
      e.getComponent('Collider').colliders[0].callbacks.add(LightSystem.lightAirCollision)
    })
    this.family.entityAddedEvent.removeObserver((e: Entity) => {
      e.getComponent('Collider').colliders[0].callbacks.delete(LightSystem.lightAirCollision)
    })
  }

  public update(): void {
    for (const light of this.family.entityIterator) {
      light.getComponent('Light').intensity = 0
    }
  }

  private static lightAirCollision(me: Collider, other: Collider): void {
    if (!other.tag.has('air')) return
    me.component.entity.getComponent('Light').intensity = 1
  }
}
