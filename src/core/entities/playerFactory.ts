import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { PlayerComponent } from '../components/playerComponent'
import { Vec2 } from '../math/vec2'
import { Category } from './category'
import { Graphics } from 'pixi.js'

export class PlayerFactory extends EntityFactory {
  readonly MASS = 10
  readonly RESTITUTION = 0
  readonly WIDTH = 64
  readonly HEIGHT = 60
  readonly FOOT_WIDTH = 60
  readonly FOOT_HEIGHT = 2
  readonly FOOT_OFFSET_X = 2
  readonly FOOT_OFFSET_Y = 60

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(200, 100)
    const body = new RigidBodyComponent(
      this.MASS,
      new Vec2(),
      new Vec2(),
      this.RESTITUTION
    )
    const draw = new DrawComponent()
    const player = new PlayerComponent()
    const collider = new ColliderComponent(entity)

    const aabbBody = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    aabbBody.category = Category.PLAYER
    aabbBody.mask = Category.WALL
    collider.createCollider(aabbBody)

    const aabbFoot = new AABBDef(new Vec2(this.FOOT_WIDTH, this.FOOT_HEIGHT))
    aabbFoot.offset = new Vec2(this.FOOT_OFFSET_X, this.FOOT_OFFSET_Y)
    aabbFoot.tag = 'foot'
    aabbFoot.category = Category.PLAYER
    aabbFoot.mask = Category.WALL
    collider.createCollider(aabbFoot)

    const graphics = new Graphics()
    graphics.beginFill(0xffff00)
    graphics.drawRect(0, 0, this.WIDTH, this.HEIGHT)
    graphics.beginFill(0xff0000)
    graphics.drawRect(
      this.FOOT_OFFSET_X,
      this.FOOT_OFFSET_Y,
      this.FOOT_WIDTH,
      this.FOOT_HEIGHT
    )
    draw.addChild(graphics)
    entity.addComponent('Position', position)
    entity.addComponent('RigidBody', body)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('Player', player)
    return entity
  }
}
