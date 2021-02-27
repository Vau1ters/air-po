import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import airGeyserDefinition from '@res/animation/airGeyser.json'
import { ColliderBuilder, ColliderComponent } from '@game/components/colliderComponent'
import { CategoryList } from './category'
import { Vec2 } from '@core/math/vec2'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { AIComponent } from '@game/components/aiComponent'
import { airGeyserAI } from '@game/ai/entity/airGeyser/airGeyserAI'
import { World } from '@core/ecs/world'
import { AnimationStateComponent } from '@game/components/animationStateComponent'

export class AirGeyserFactory extends EntityFactory {
  private readonly INV_MASS = 0
  private readonly RESTITUTION = 0
  private readonly AABB = {
    offset: new Vec2(-5, 3),
    size: new Vec2(10, 13),
  }

  private position: Vec2 = new Vec2()
  private maxQuantity = 120
  private increaseRate = 0.2

  public constructor(private world: World) {
    super()
  }

  public setPosition(x: number, y: number): void {
    this.position.x = x
    this.position.y = y
  }

  public setMaxQuantity(maxQuantity: number): void {
    this.maxQuantity = maxQuantity
  }

  public setIncreaseRate(increaseRate: number): void {
    this.increaseRate = increaseRate
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(this.position.x, this.position.y)
    const draw = new DrawComponent(entity)

    const collider = new ColliderComponent()
    collider.colliders.push(
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.AABB)
        .setCategory(CategoryList.airGeyser)
        .build()
    )

    const rigidBody = new RigidBodyComponent(0, new Vec2(), new Vec2(), this.RESTITUTION, 0)
    rigidBody.invMass = this.INV_MASS

    const sprite = parseAnimation(airGeyserDefinition.sprite)

    draw.addChild(sprite)

    const animState = new AnimationStateComponent(sprite)

    const ai = new AIComponent(
      airGeyserAI(entity, this.world, {
        maxQuantity: this.maxQuantity,
        increaseRate: this.increaseRate,
      })
    )

    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('RigidBody', rigidBody)
    entity.addComponent('AI', ai)
    entity.addComponent('AnimationState', animState)
    return entity
  }
}
