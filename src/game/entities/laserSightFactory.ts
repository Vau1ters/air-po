import { CollisionResult, CollisionResultRayAndAABB } from '@core/collision/collision'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { laserSightAI } from '@game/ai/entity/laserSight/laserSightAI'
import { AIComponent } from '@game/components/aiComponent'
import { Collider, ColliderBuilder, ColliderComponent } from '@game/components/colliderComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { assert } from '@utils/assertion'
import { Graphics } from 'pixi.js'
import { CategoryList } from './category'
import { EntityFactory } from './entityFactory'

export class LaserSightFactory extends EntityFactory {
  constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    const g = new Graphics()
    g.position.set(0)
    const draw = new DrawComponent(entity, 'WorldUI')
    draw.addChild(g)
    entity.addComponent('Draw', draw)

    const collider = new ColliderComponent()
    collider.colliders.push(
      new ColliderBuilder()
        .setEntity(entity)
        .setRay({
          direction: new Vec2(),
        })
        .setCategory(CategoryList.laserSight)
        .setIsSensor(true)
        .addCallback((me: Collider, other: Collider, result: CollisionResult) => {
          const tmp = result as CollisionResultRayAndAABB
          assert(tmp.hit === true, 'unexpected code')
          const { hitPoint } = tmp
          const [player] = new FamilyBuilder(this.world).include('Player').build().entityArray
          const position = player.getComponent('Position')
          g.clear()
          g.lineStyle(0.5, 0xff0000)
          g.moveTo(position.x, position.y)
          g.lineTo(hitPoint.x, hitPoint.y)
          g.beginFill(0xff0000)
          g.drawCircle(hitPoint.x, hitPoint.y, 2)
        })
        .build()
    )
    entity.addComponent('Collider', collider)

    entity.addComponent('AI', new AIComponent(laserSightAI(entity, this.world)))

    entity.addComponent('Position', new PositionComponent())

    return entity
  }
}
