import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { Vec2 } from '../math/vec2'
import { CategoryList } from './category'
import { Sprite } from 'pixi.js'
import { wallBaseTextures } from '../graphics/art'

export class WallFactory extends EntityFactory {
  readonly INV_MASS = 0
  readonly RESTITUTION = 0
  readonly WIDTH = 8
  readonly HEIGHT = 8
  public tileId = 0

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent()
    const body = new RigidBodyComponent(0, new Vec2(), new Vec2(), this.RESTITUTION, 0)
    body.invMass = this.INV_MASS
    const draw = new DrawComponent()

    const aabb = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    aabb.tag = 'wall'
    aabb.category = CategoryList.wall.category
    aabb.mask = CategoryList.wall.mask

    const collider = new ColliderComponent(entity)
    collider.createCollider(aabb)

    entity.addComponent('Position', position)
    entity.addComponent('RigidBody', body)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    // const graphics = new Graphics()
    // graphics.beginFill(0xff00ff)
    // graphics.drawRect(0, 0, this.WIDTH, this.HEIGHT)
    const sprite = new Sprite(wallBaseTextures[this.tileId])
    draw.addChild(sprite)
    return entity
  }
}
