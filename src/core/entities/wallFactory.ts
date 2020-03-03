import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent } from '../components/colliderComponent'
import { Vec2 } from '../math/vec2'
import { Category } from './category'
import { Graphics } from 'pixi.js'

export class WallFactory extends EntityFactory {
  readonly INV_MASS = 0
  readonly RESTITUTION = 0
  readonly WIDTH = 64
  readonly HEIGHT = 64

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent()
    const body = new RigidBodyComponent(
      0,
      new Vec2(),
      new Vec2(),
      this.RESTITUTION,
      0
    )
    body.invMass = this.INV_MASS
    const draw = new DrawComponent()
    const collider = new ColliderComponent(entity)
    collider.createAABB(
      new Vec2(this.WIDTH, this.HEIGHT),
      new Vec2(),
      false,
      null,
      '',
      Category.WALL,
      Category.PLAYER
    )
    entity.addComponent('Position', position)
    entity.addComponent('RigidBody', body)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    const graphics = new Graphics()
    graphics.beginFill(0xff00ff)
    graphics.drawRect(0, 0, this.WIDTH, this.HEIGHT)
    draw.addChild(graphics)
    return entity
  }
}
