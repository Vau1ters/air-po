import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder, Family } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { AIR_TAG } from './airSystem'
import { Category } from '@game/entities/category'
import { assert } from '@utils/assertion'

export const LIGHT_TAG = 'Light'

export class LightSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Light').build()

    this.family.entityAddedEvent.addObserver((e: Entity) => {
      for (const c of e.getComponent('Collider').colliders) {
        if (c.tag.has(LIGHT_TAG)) {
          assert(
            c.category === Category.LIGHT,
            `Collider with '${LIGHT_TAG}' tag must have LIGHT category`
          )
          assert(c.mask.has(Category.AIR), `Collider with '${LIGHT_TAG}' tag must have AIR mask`)
          c.callbacks.add(LightSystem.lightAirCollision)
        }
      }
    })
    this.family.entityAddedEvent.removeObserver((e: Entity) => {
      for (const c of e.getComponent('Collider').colliders) {
        if (c.tag.has(LIGHT_TAG)) {
          c.callbacks.delete(LightSystem.lightAirCollision)
        }
      }
    })
  }

  public update(): void {
    for (const light of this.family.entityIterator) {
      light.getComponent('Light').intensity = 0
    }
  }

  private static lightAirCollision(args: CollisionCallbackArgs): void {
    const { me, other } = args
    if (!other.tag.has(AIR_TAG)) return
    me.entity.getComponent('Light').intensity = 1
  }
}
