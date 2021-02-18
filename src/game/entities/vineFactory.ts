import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { ColliderBuilder, ColliderComponent } from '@game/components/colliderComponent'
import { Vec2 } from '@core/math/vec2'
import { CategoryList } from './category'
import vineDefinition from '@res/animation/vine.json'
import { VineComponent } from '@game/components/vineComponent'
import { AIComponent } from '@game/components/aiComponent'
import { vineAI } from '@game/ai/entity/vine/vineAI'
import { parseAnimation } from '@core/graphics/animationParser'
import { addTag } from '@game/ai/entity/vine/changeVineLength'

export class VineFactory extends EntityFactory {
  readonly INV_MASS = 0
  readonly RESTITUTION = 0
  readonly WIDTH = 16
  readonly HEIGHT = 16
  readonly OFFSET_X = -8
  readonly OFFSET_Y = -8

  readonly WALL_SENSOR_WIDTH = 14
  readonly WALL_SENSOR_HEIGHT = 5
  readonly WALL_SENSOR_OFFSET_X = -7
  readonly WALL_SENSOR_OFFSET_Y = 0

  readonly AIR_SENSOR_WIDTH = 6
  readonly AIR_SENSOR_HEIGHT = 6
  readonly AIR_SENSOR_OFFSET_X = -3
  readonly AIR_SENSOR_OFFSET_Y = -3

  public constructor() {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent()

    const collider = new ColliderComponent()
    collider.colliders.push(
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB({
          offset: new Vec2(this.OFFSET_X, this.OFFSET_Y),
          size: new Vec2(this.WIDTH, this.HEIGHT),
        })
        .setCategory(CategoryList.vine.body)
        .addTag('vine')
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB({
          offset: new Vec2(this.WALL_SENSOR_OFFSET_X, this.WALL_SENSOR_OFFSET_Y),
          size: new Vec2(this.WALL_SENSOR_WIDTH, this.WALL_SENSOR_HEIGHT),
        })
        .setCategory(CategoryList.vine.wallSensor)
        .addTag('vineWallSensor')
        .setIsSensor(true)
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB({
          offset: new Vec2(this.AIR_SENSOR_OFFSET_X, this.AIR_SENSOR_OFFSET_Y),
          size: new Vec2(this.AIR_SENSOR_WIDTH, this.AIR_SENSOR_HEIGHT),
        })
        .setCategory(CategoryList.vine.airSensor)
        .addTag('vineAirSensor')
        .setIsSensor(true)
        .build()
    )

    const body = new RigidBodyComponent(0, new Vec2(), new Vec2(), this.RESTITUTION, 0)
    body.invMass = this.INV_MASS

    const vine = new VineComponent(0)

    entity.addComponent('Collider', collider)

    addTag(entity)

    const ai = new AIComponent(vineAI(entity))

    const sprite = parseAnimation(vineDefinition.sprite)
    sprite.changeTo('Root0')
    const draw = new DrawComponent(entity)
    draw.addChild(sprite)

    entity.addComponent('AI', ai)
    entity.addComponent('RigidBody', body)
    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('Vine', vine)

    vine.sprites.push(sprite)
    return entity
  }
}
