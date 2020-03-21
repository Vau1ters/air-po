import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { PlayerComponent } from '../components/playerComponent'
import { Vec2 } from '../math/vec2'
import { Category } from './category'
import { playerTextures } from '../graphics/art'
import { Animation } from '../graphics/animation'
import { HorizontalDirectionComponent } from '../components/directionComponent'
import { Graphics } from 'pixi.js'

export class PlayerFactory extends EntityFactory {
  readonly MASS = 10
  readonly RESTITUTION = 0
  readonly WIDTH = 10
  readonly HEIGHT = 13
  readonly OFFSET_X = -5
  readonly OFFSET_Y = -6
  readonly FOOT_WIDTH = this.WIDTH - 2
  readonly FOOT_HEIGHT = 1
  readonly FOOT_OFFSET_X = 1
  readonly FOOT_OFFSET_Y = 13
  readonly FOOT_CLIP_TOLERANCE_X = 2
  readonly FOOT_CLIP_TOLERANCE_Y = 2
  readonly CLIP_TOLERANCE_X =
    (this.WIDTH - this.FOOT_WIDTH) / 2 + this.FOOT_CLIP_TOLERANCE_X
  readonly CLIP_TOLERANCE_Y = 4

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
    const direction = new HorizontalDirectionComponent('Right')
    const collider = new ColliderComponent(entity)

    const aabbBody = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    aabbBody.tag = 'playerBody'
    aabbBody.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    aabbBody.category = Category.PLAYER
    aabbBody.mask = Category.ALL & ~Category.MOVERS
    aabbBody.maxClipTolerance = new Vec2(
      this.CLIP_TOLERANCE_X,
      this.CLIP_TOLERANCE_Y
    )
    collider.createCollider(aabbBody)

    const aabbFoot = new AABBDef(new Vec2(this.FOOT_WIDTH, this.FOOT_HEIGHT))
    aabbFoot.offset = new Vec2(
      this.OFFSET_X + this.FOOT_OFFSET_X,
      this.OFFSET_Y + this.FOOT_OFFSET_Y
    )
    aabbFoot.tag = 'playerFoot'
    aabbFoot.category = Category.PLAYER
    aabbFoot.mask = Category.ALL & ~Category.MOVERS
    aabbFoot.maxClipTolerance = new Vec2(
      this.FOOT_CLIP_TOLERANCE_X,
      this.FOOT_CLIP_TOLERANCE_Y
    )
    collider.createCollider(aabbFoot)

    const graphics = new Graphics()
    graphics.beginFill(0xffff00)
    graphics.drawRect(this.OFFSET_X, this.OFFSET_Y, this.WIDTH, this.HEIGHT)
    graphics.beginFill(0xff0000)
    graphics.drawRect(
      this.OFFSET_X + this.FOOT_OFFSET_X,
      this.OFFSET_Y + this.FOOT_OFFSET_Y,
      this.FOOT_WIDTH,
      this.FOOT_HEIGHT
    )
    const animatedTexture = {
      Standing: [playerTextures[0]],
      Walking: [playerTextures[0], playerTextures[1]],
      Jumping: [playerTextures[1]],
    }
    const sprite = new Animation(animatedTexture, 'Standing')
    graphics.addChild(sprite)
    draw.addChild(graphics)
    player.changeState.addObserver(x => sprite.changeTo(x))
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
    entity.addComponent('Player', player)
    return entity
  }
}
