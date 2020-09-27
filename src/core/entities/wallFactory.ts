import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { Vec2 } from '../math/vec2'
import { CategoryList } from './category'
import { textureStore } from '../graphics/art'
import { Sprite } from 'pixi.js'

export class WallFactory extends EntityFactory {
  readonly INV_MASS = 0
  readonly RESTITUTION = 0
  readonly WIDTH = 8
  readonly HEIGHT = 8
  readonly OFFSET_X = -this.WIDTH / 2
  readonly OFFSET_Y = -this.HEIGHT / 2
  public tileId = 0
  public shouldCollide = true

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent()
    const draw = new DrawComponent()

    if (this.shouldCollide) {
      const aabb = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
      aabb.tag.add('wall')
      aabb.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
      aabb.category = CategoryList.wall.category
      aabb.mask = CategoryList.wall.mask
      const collider = new ColliderComponent(entity)
      collider.createCollider(aabb)
      entity.addComponent('Collider', collider)

      const body = new RigidBodyComponent(0, new Vec2(), new Vec2(), this.RESTITUTION, 0)
      body.invMass = this.INV_MASS
      entity.addComponent('RigidBody', body)
    }

    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    const sprite = new Sprite(textureStore.wall[this.tileId])
    draw.addChild(sprite)
    return entity
  }
}
