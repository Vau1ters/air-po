import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import mossDefinition from '@res/animation/moss.json'
import { World } from '@core/ecs/world'
import { AABBDef, ColliderComponent } from '@game/components/colliderComponent'
import { CategoryList } from './category'
import { Vec2 } from '@core/math/vec2'
import { LightComponent } from '@game/components/lightComponent'

export class MossFactory extends EntityFactory {
  readonly WIDTH = 8
  readonly HEIGHT = 8

  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(200, 100)
    const collider = new ColliderComponent(entity)

    const light = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT), CategoryList.moss.light)
    light.tag.add('light')
    light.offset = new Vec2(-this.WIDTH / 2, -this.HEIGHT / 2)
    collider.createCollider(light)

    const airSensor = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT), CategoryList.moss.airSensor)
    airSensor.offset = new Vec2(-this.WIDTH / 2, -this.HEIGHT / 2)
    collider.createCollider(airSensor)

    const sprite = parseAnimation(mossDefinition.sprite)
    const draw = new DrawComponent(entity)
    draw.addChild(sprite)

    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('Light', new LightComponent(0))
    return entity
  }
}
