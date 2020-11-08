import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import airTotemDefinition from '@res/animation/airTotem.json'
import { AABBDef, ColliderComponent } from '@game/components/colliderComponent'
import { CategoryList } from './category'
import { Vec2 } from '@core/math/vec2'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { AIComponent } from '@game/components/aiComponent'
import { airTotemAI } from '@game/ai/entity/airTotem/airTotemAI'
import { World } from '@core/ecs/world'

export class AirTotemFactory extends EntityFactory {
  readonly INV_MASS = 0
  readonly RESTITUTION = 0
  readonly WIDTH = 10
  readonly HEIGHT = 28
  readonly OFFSET_X = -5
  readonly OFFSET_Y = -14

  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent()
    const draw = new DrawComponent(entity)
    const collider = new ColliderComponent(entity)

    const aabb = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT), CategoryList.airTotem)
    aabb.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    collider.createCollider(aabb)

    const rigidBody = new RigidBodyComponent(0, new Vec2(), new Vec2(), this.RESTITUTION, 0)
    rigidBody.invMass = this.INV_MASS

    const sprite = parseAnimation(airTotemDefinition.sprite)

    draw.addChild(sprite)

    const ai = new AIComponent(airTotemAI(entity, this.world))

    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('RigidBody', rigidBody)
    entity.addComponent('AI', ai)
    return entity
  }
}
