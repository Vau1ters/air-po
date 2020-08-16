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
import { World } from '../ecs/world'
import { parseSprite } from '../parser/spriteParser'
import { addTag } from '../ai/action/extendVine'

export class VineFactory extends EntityFactory {
  readonly INV_MASS = 0
  readonly RESTITUTION = 0
  readonly WIDTH = 16
  readonly HEIGHT = 16
  readonly OFFSET_X = -8
  readonly OFFSET_Y = -8

  readonly SENSOR_WIDTH = 16
  readonly SENSOR_HEIGHT = 15
  readonly SENSOR_OFFSET_X = -8
  readonly SENSOR_OFFSET_Y = 8

  public constructor(private world: World) {
    super()
  }

  public parent: Entity | undefined = undefined
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

    const aabbSensor = new AABBDef(new Vec2(this.SENSOR_WIDTH, this.SENSOR_HEIGHT))
    aabbSensor.offset = new Vec2(this.SENSOR_OFFSET_X, this.SENSOR_OFFSET_Y)
    aabbSensor.tag.add('vineSensor')
    aabbSensor.category = CategoryList.vine.category
    aabbSensor.mask = CategoryList.vine.mask
    aabbSensor.isSensor = true
    collider.createCollider(aabbSensor)

    const body = new RigidBodyComponent(0, new Vec2(), new Vec2(), this.RESTITUTION, 0)
    body.invMass = this.INV_MASS

    if (this.parent) {
      this.parent.getComponent('Vine').child = entity
    }

    const vine = new VineComponent(this.parent, 3)

    entity.addComponent('Collider', collider)

    addTag(entity)

    const ai = new AIComponent(vineAI(entity, this.world))

    entity.addComponent('AI', ai)
    entity.addComponent('RigidBody', body)
    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('Vine', vine)

    const sprite = parseSprite(vineDefinition.sprite)
    draw.addChild(sprite)
    return entity
  }
}
