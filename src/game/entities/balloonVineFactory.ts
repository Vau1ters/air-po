import { EntityFactory } from './entityFactory'
import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import { ColliderComponent, ColliderBuilder } from '@game/components/colliderComponent'
import { CategoryList } from './category'
import { HPComponent } from '@game/components/hpComponent'
import { InvincibleComponent } from '@game/components/invincibleComponent'
import { AIComponent } from '@game/components/aiComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import { PickupTargetComponent } from '@game/components/pickupTargetComponent'
import { AirHolderComponent } from '@game/components/airHolderComponent'
import balloonvineDefinition from '@res/animation/balloonvine.json'
import { World } from '@core/ecs/world'
import { balloonvineAI } from '@game/ai/entity/balloonVine/balloonVineAI'

export class BalloonVineFactory extends EntityFactory {
  private readonly GRIP_AABB = {
    maxClipToTolerance: new Vec2(2, 2),
  }
  private readonly BODY_AABB = {
    offset: new Vec2(-5, -6),
    size: new Vec2(10, 13),
    maxClipToTolerance: new Vec2(2, 2),
  }
  private readonly ROOT_AABB = {
    size: new Vec2(5, 5),
  }
  private readonly WALL_AABB = {
    size: new Vec2(2, 10),
  }

  private readonly INITIAL_AIR_QUANTITY = 0
  private readonly MAX_AIR_QUANTITY = 10
  private readonly AIR_COLLECT_SPEED = 10
  private readonly AIR_CONSUME_SPEED = 0

  private readonly MASS = 0.0001
  private readonly RESTITUTION = 0

  constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(0, 0)
    const hp = new HPComponent(1, 1)
    const invincible = new InvincibleComponent()
    const airHolder = new AirHolderComponent({
      initialQuantity: this.INITIAL_AIR_QUANTITY,
      maxQuantity: this.MAX_AIR_QUANTITY,
      collectSpeed: this.AIR_COLLECT_SPEED,
      consumeSpeed: this.AIR_CONSUME_SPEED,
    })
    const pickup = new PickupTargetComponent(false)

    const body = new RigidBodyComponent(this.MASS, new Vec2(), new Vec2(), this.RESTITUTION)

    const collider = new ColliderComponent()
    collider.colliders.push(
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.GRIP_AABB)
        .setCategory(CategoryList.balloonVine.grip)
        .addTag('balloonVine')
        .setIsSensor(true)
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.BODY_AABB)
        .setCategory(CategoryList.balloonVine.body)
        .addTag('balloonVine')
        .setIsSensor(true)
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.BODY_AABB)
        .setCategory(CategoryList.balloonVine.airSensor)
        .addTag('airHolderBody')
        .setIsSensor(true)
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.ROOT_AABB)
        .setCategory(CategoryList.balloonVine.root)
        .addTag('balloonVine')
        .setIsSensor(true)
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.WALL_AABB)
        .setCategory(CategoryList.balloonVine.wallSensor)
        .addTag('balloonVine')
        .setIsSensor(true)
        .build()
    )

    const sprite = parseAnimation(balloonvineDefinition.sprite)
    sprite.zIndex = 1
    const draw = new DrawComponent(entity)
    draw.sortableChildren = true
    draw.addChild(sprite)

    const animState = new AnimationStateComponent(sprite)

    const ai = new AIComponent(balloonvineAI(entity, this.world))

    entity.addComponent('AI', ai)
    entity.addComponent('Position', position)
    entity.addComponent('RigidBody', body)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('HP', hp)
    entity.addComponent('Invincible', invincible)
    entity.addComponent('PickupTarget', pickup)
    entity.addComponent('AnimationState', animState)
    entity.addComponent('AirHolder', airHolder)
    return entity
  }
}
