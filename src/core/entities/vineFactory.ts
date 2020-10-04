import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { Vec2 } from '../math/vec2'
import { CategoryList } from './category'
import vineDefinition from '../../../res/entities/vine.json'
import { VineComponent } from '../components/vineComponent'
import { AIComponent } from '../components/aiComponent'
import { vineAI } from '../ai/vineAI'
import { parseSprite } from '../parser/spriteParser'
import { addTag } from '../ai/action/changeVineLength'

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
    const draw = new DrawComponent()

    const aabb = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    aabb.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    aabb.tag.add('vine')
    aabb.category = CategoryList.vine.category
    aabb.mask = CategoryList.vine.mask
    const collider = new ColliderComponent(entity)
    collider.createCollider(aabb)

    const wallSensor = new AABBDef(new Vec2(this.WALL_SENSOR_WIDTH, this.WALL_SENSOR_HEIGHT))
    wallSensor.offset = new Vec2(this.WALL_SENSOR_OFFSET_X, this.WALL_SENSOR_OFFSET_Y)
    wallSensor.tag.add('vineWallSensor')
    wallSensor.category = CategoryList.vine.category
    wallSensor.mask = CategoryList.vine.mask
    wallSensor.isSensor = true
    collider.createCollider(wallSensor)

    const airSensor = new AABBDef(new Vec2(this.AIR_SENSOR_WIDTH, this.AIR_SENSOR_HEIGHT))
    airSensor.offset = new Vec2(this.AIR_SENSOR_OFFSET_X, this.AIR_SENSOR_OFFSET_Y)
    airSensor.tag.add('vineAirSensor')
    airSensor.category = CategoryList.vine.category
    airSensor.mask = CategoryList.vine.mask
    airSensor.isSensor = true
    collider.createCollider(airSensor)

    const body = new RigidBodyComponent(0, new Vec2(), new Vec2(), this.RESTITUTION, 0)
    body.invMass = this.INV_MASS

    const vine = new VineComponent(0)

    entity.addComponent('Collider', collider)

    addTag(entity)

    const ai = new AIComponent(vineAI(entity))

    entity.addComponent('AI', ai)
    entity.addComponent('RigidBody', body)
    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('Vine', vine)

    const sprite = parseSprite(vineDefinition.sprite)
    sprite.changeTo('Root0')
    vine.sprites.push(sprite)
    draw.addChild(sprite)
    return entity
  }
}
