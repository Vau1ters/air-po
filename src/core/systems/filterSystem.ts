import { System } from '../ecs/system'
import { World } from '../ecs/world'
import { Container } from 'pixi.js'
import { AirFilter } from '../../filters/airFilter'
import { DarknessFilter } from '../../filters/darknessFilter'
import { windowSize } from '../application'
import { Entity } from '../ecs/entity'
import { AABBDef, Collider, ColliderComponent } from '../components/colliderComponent'
import { Vec2 } from '../math/vec2'
import { CategoryList } from '../entities/category'
import { Family, FamilyBuilder } from '../ecs/family'
import { PositionComponent } from '../components/positionComponent'

export class FilterSystem extends System {
  private airFilter: AirFilter
  private darknessFilter: DarknessFilter
  private lights: Array<Entity>
  private airFamily: Family
  private cameraFamily: Family
  private lightSearcher: Entity

  public static settings = {
    air: {
      antiAlias: false,
    },
    darkness: {
      defaultBrightness: 0.8,
    },
  }

  public constructor(world: World, container: Container) {
    super(world)

    this.airFilter = new AirFilter(
      world,
      { x: windowSize.width, y: windowSize.height },
      FilterSystem.settings.air
    )
    this.darknessFilter = new DarknessFilter(
      { x: windowSize.width, y: windowSize.height },
      FilterSystem.settings.darkness
    )
    this.lights = []
    this.airFamily = new FamilyBuilder(world).include('Air').build()
    this.cameraFamily = new FamilyBuilder(world).include('Camera').build()

    this.lightSearcher = new Entity()
    const aabbBody = new AABBDef(
      new Vec2(windowSize.width, windowSize.height),
      CategoryList.lightSearcher
    )
    aabbBody.tag.add('screen')
    aabbBody.isSensor = true
    const collider = new ColliderComponent(this.lightSearcher)
    collider.createCollider(aabbBody)
    collider.colliders[0].callbacks.add((me: Collider, other: Collider) => {
      if (!other.tag.has('light')) return
      this.lights.push(other.entity)
    })
    this.lightSearcher.addComponent('Collider', collider)
    this.lightSearcher.addComponent('Position', new PositionComponent())
    world.addEntity(this.lightSearcher)

    container.filters = [this.airFilter, this.darknessFilter]
  }

  public update(): void {
    this.updateAirFilter()
    this.updateDarknessFilter()
    this.updateSearcher()
  }

  private updateAirFilter(): void {
    const camera = this.cameraFamily.entityArray[0].getComponent('Position')

    const airs = []
    for (const entity of this.airFamily.entityIterator) {
      const air = entity.getComponent('Air')
      const position = entity.getComponent('Position')

      const radius = air.quantity

      airs.push({
        center: new PositionComponent(
          position.x + windowSize.width / 2,
          position.y + windowSize.height / 2
        ),
        radius,
      })
    }

    this.airFilter.updateUniforms(airs, camera)
  }

  private updateDarknessFilter(): void {
    const offset = this.cameraFamily.entityArray[0].getComponent('Position')
    this.darknessFilter.lights = this.lights.map(e => {
      const pos = e.getComponent('Position')
      const light = e.getComponent('Light')
      return {
        center: {
          x: pos.x - offset.x + windowSize.width / 2,
          y: pos.y - offset.y + windowSize.height / 2,
        },
        intensity: light.intensity,
      }
    })
    this.lights = []
  }

  private updateSearcher(): void {
    for (const camera of this.cameraFamily.entityIterator) {
      const cameraPos = camera.getComponent('Position')
      const searcherPos = this.lightSearcher.getComponent('Position')
      searcherPos.x = cameraPos.x - windowSize.width / 2
      searcherPos.y = cameraPos.y - windowSize.height / 2
    }
  }
}
