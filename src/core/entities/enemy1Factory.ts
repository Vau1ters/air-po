import { EntityFactory } from './entityFactory'
import { Entity } from '../ecs/entity'
import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { Vec2 } from '../math/vec2'
import { DrawComponent } from '../components/drawComponent'
import { HorizontalDirectionComponent } from '../components/directionComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { enemy1Textures } from '../graphics/art'
import { Animation } from '../graphics/animation'
import { Category, CategorySet } from './category'

export class Enemy1Factory extends EntityFactory {
  readonly MASS = 10
  readonly RESTITUTION = 0
  readonly WIDTH = 10
  readonly HEIGHT = 13
  readonly OFFSET_X = -5
  readonly OFFSET_Y = -6
  readonly CLIP_TOLERANCE_X = 2
  readonly CLIP_TOLERANCE_Y = 2
  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(200, 100)
    const body = new RigidBodyComponent(
      this.MASS,
      new Vec2(),
      new Vec2(),
      this.RESTITUTION,
      0
    )
    const draw = new DrawComponent()
    const direction = new HorizontalDirectionComponent('Right')
    const collider = new ColliderComponent(entity)

    const aabbBody = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    aabbBody.tag = 'enemy1Body'
    aabbBody.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    aabbBody.category = Category.ENEMY

    const mask = new Set(CategorySet.ALL)
    CategorySet.MOVERS.forEach(x => mask.delete(x))
    aabbBody.mask = mask

    aabbBody.maxClipTolerance = new Vec2(
      this.CLIP_TOLERANCE_X,
      this.CLIP_TOLERANCE_Y
    )
    collider.createCollider(aabbBody)

    const animatedTexture = {
      Floating: [enemy1Textures[0], enemy1Textures[1]],
    }
    const sprite = new Animation(animatedTexture, 'Floating')
    draw.addChild(sprite)
    direction.changeDirection.addObserver(x => {
      if (x === 'Left') {
        sprite.scale.x = -1
      } else {
        sprite.scale.x = 1
      }
    })

    entity.addComponent('Position', position)
    entity.addComponent('RigidBody', body)
    entity.addComponent('HorizontalDirection', direction)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    return entity
  }
}
