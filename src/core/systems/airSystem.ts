import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { FamilyBuilder, Family } from '../ecs/family'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/positionComponent'
import { Container } from 'pixi.js'
import { AirFilter } from '../../filters/airFilter'
import { AirDef, ColliderComponent, AirCollider } from '../components/colliderComponent'
import { windowSize } from '../application'
import { AABB } from '../math/aabb'
import { Vec2 } from '../math/vec2'
import { assert } from '../../utils/assertion'
import { CategoryList } from '../entities/category'

export class AirSystem extends System {
  private family: Family

  private filter: AirFilter

  public offset: PositionComponent = new PositionComponent()

  private entity: Entity

  public constructor(world: World, container: Container) {
    super(world)

    this.family = new FamilyBuilder(world).include('Air', 'Position').build()

    this.filter = new AirFilter({ x: windowSize.width, y: windowSize.height })

    container.filters = [this.filter]

    this.entity = new Entity()
    const collider = new ColliderComponent(this.entity)
    const air = new AirDef(this.family)
    air.tag.add('air')
    air.isSensor = true
    air.category = CategoryList.air.category
    air.mask = CategoryList.air.mask
    collider.createCollider(air)
    this.entity.addComponent('Collider', collider)
    this.entity.addComponent('Position', new PositionComponent())
    this.world.addEntity(this.entity)
  }

  public update(): void {
    const airs = []
    for (const entity of this.family.entityIterator) {
      const air = entity.getComponent('Air')
      const position = entity.getComponent('Position')

      if (air.quantity <= 0) {
        this.world.removeEntity(entity)
        continue
      }

      const radius = air.quantity

      airs.push({
        center: new PositionComponent(
          position.x - this.offset.x + windowSize.width / 2,
          position.y - this.offset.y + windowSize.height / 2
        ),
        radius,
      })
    }
    this.filter.airs = airs

    const collider = this.entity.getComponent('Collider')
    const airCollider = collider.colliders[0]
    assert(airCollider instanceof AirCollider)

    const aabbBounds: AABB[] = airCollider.airFamily.entityArray.map((e: Entity) => {
      const p = e.getComponent('Position')
      return new AABB(
        p.sub(new Vec2(AirFilter.EFFECTIVE_RADIUS, AirFilter.EFFECTIVE_RADIUS)),
        new Vec2(AirFilter.EFFECTIVE_RADIUS * 2, AirFilter.EFFECTIVE_RADIUS * 2)
      )
    })
    airCollider.bound = aabbBounds.reduce((a, b) => a.merge(b))
  }
}
