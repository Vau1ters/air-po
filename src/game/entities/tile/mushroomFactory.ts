import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { mushroomAI } from '@game/ai/entity/mushroom/mushroomAI'
import { AIComponent } from '@game/components/aiComponent'
import { AirHolderComponent } from '@game/components/airHolderComponent'
import { ColliderComponent, buildColliders } from '@game/components/colliderComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { AIR_HOLDER_TAG } from '@game/systems/airHolderSystem'
import { PHYSICS_TAG } from '@game/systems/physicsSystem'
import { Category, CategorySet } from '../category'
import { TileEntityFactory } from './tileEntityFactory'

export class MushroomFactory extends TileEntityFactory {
  private readonly MUSHROOM_WIDTH = 78
  private readonly MUSHROOM_HEIGHT = 44
  private readonly STALK_WIDTH = 18
  private readonly STALK_HEIGHT = this.MUSHROOM_HEIGHT
  private readonly PILEUS_WIDTH = this.MUSHROOM_WIDTH
  private readonly PILEUS_HEIGHT = 19

  private readonly WALL_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(-1, 6),
    size: new Vec2(this.STALK_WIDTH, this.STALK_HEIGHT),
  }

  private readonly JUMP_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(0, 6 + this.PILEUS_HEIGHT / 4 - this.MUSHROOM_HEIGHT / 2),
    size: new Vec2(this.PILEUS_WIDTH, this.PILEUS_HEIGHT / 2),
  }

  private readonly FLOOR_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(0, 6 + (this.PILEUS_HEIGHT * 3) / 4 - this.MUSHROOM_HEIGHT / 2),
    size: new Vec2(this.PILEUS_WIDTH, this.PILEUS_HEIGHT / 2),
  }

  private readonly AIR_HOLDER_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(0, 6),
    size: new Vec2(this.MUSHROOM_WIDTH, this.MUSHROOM_HEIGHT),
  }

  private readonly AIR_HOLDER = {
    initialQuantity: 0,
    maxQuantity: 1,
    collectSpeed: 1,
    consumeSpeed: 0,
    shouldDamageInSuffocation: false,
  }

  public create(): Entity {
    const entity = super.create()

    entity.addComponent(
      'Collider',
      new ColliderComponent(
        ...buildColliders({
          entity,
          colliders: [
            {
              geometry: this.JUMP_COLLIDER,
              category: Category.TERRAIN,
              mask: new CategorySet(Category.PHYSICS),
              tag: [PHYSICS_TAG],
              condition: (): boolean => entity.getComponent('AirHolder').quantity > 0,
            },
            {
              geometry: this.FLOOR_COLLIDER,
              category: Category.TERRAIN,
              mask: new CategorySet(Category.PHYSICS),
              tag: [PHYSICS_TAG],
              condition: (): boolean => entity.getComponent('AirHolder').quantity > 0,
            },
            {
              geometry: this.WALL_COLLIDER,
              category: Category.TERRAIN,
              mask: new CategorySet(Category.PHYSICS),
              tag: [PHYSICS_TAG],
            },
            {
              geometry: this.AIR_HOLDER_COLLIDER,
              category: Category.AIR_HOLDER,
              mask: new CategorySet(Category.AIR),
              tag: [AIR_HOLDER_TAG],
            },
          ],
        })
      )
    )
    entity.addComponent('RigidBody', new RigidBodyComponent())
    entity.addComponent('AirHolder', new AirHolderComponent(this.AIR_HOLDER))
    entity.addComponent('AI', new AIComponent(mushroomAI(entity, this.world)))

    if (this.frame === 0) entity.getComponent('AirHolder').quantity = this.AIR_HOLDER.maxQuantity

    return entity
  }
}
