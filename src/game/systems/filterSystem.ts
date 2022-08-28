import { dependsOn, System } from '@core/ecs/system'
import { World } from '@core/ecs/world'
import { Container } from 'pixi.js'
import { AirFilter } from '@game/filters/airFilter'
import { DarknessFilter } from '@game/filters/darknessFilter'
import { windowSize } from '@core/application'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { CategorySet } from '@game/entities/category'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { PositionComponent } from '@game/components/positionComponent'
import {
  buildCollider,
  ColliderComponent,
  CollisionCallbackArgs,
} from '@game/components/colliderComponent'
import { LIGHT_TAG } from './lightSystem'
import { SuffocationFilter } from '@game/filters/suffocationFilter'
import { SUFFOCATION_DAMAGE_INTERVAL } from './airHolderSystem'
import { getSingleton } from './singletonSystem'

export class FilterSystem extends System {
  private airFilter: AirFilter
  private darknessFilter: DarknessFilter
  private suffocationFilter: SuffocationFilter
  private lights: Array<Entity>
  private airFamily: Family
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
    this.suffocationFilter = new SuffocationFilter({ x: windowSize.width, y: windowSize.height })
    this.lights = []
    this.airFamily = new FamilyBuilder(world).include('Air').build()

    this.lightSearcher = new Entity()

    this.lightSearcher.addComponent(
      'Collider',
      new ColliderComponent(
        buildCollider({
          entity: this.lightSearcher,
          geometry: {
            type: 'AABB',
            offset: new Vec2(windowSize.width / 2, windowSize.height / 2),
            size: new Vec2(windowSize.width, windowSize.height),
          },
          category: 'sensor',
          mask: new CategorySet('light'),
          callbacks: [
            (args: CollisionCallbackArgs): void => {
              const { other } = args
              if (!other.tag.has(LIGHT_TAG)) return
              this.lights.push(other.entity)
            },
          ],
        })
      )
    )
    this.lightSearcher.addComponent('Position', new PositionComponent())

    container.filters = [this.airFilter, this.darknessFilter, this.suffocationFilter]
  }

  public init(): void {
    this.lights = []
    this.world.addEntity(this.lightSearcher)
  }

  @dependsOn({
    after: ['CameraSystem:update'],
  })
  public update(): void {
    const camera = getSingleton('Camera', this.world)
    this.updateAirFilter(camera)
    this.updateDarknessFilter(camera)
    this.updateSuffocationFilter()
    this.updateSearcher(camera)
  }

  private updateAirFilter(camera: Entity): void {
    const cameraPos = camera.getComponent('Position')

    const airs = []
    for (const entity of this.airFamily.entityIterator) {
      const air = entity.getComponent('Air')
      const position = entity.getComponent('Position')

      const radius = air.radius

      airs.push({
        center: new PositionComponent(
          position.x + windowSize.width / 2,
          position.y + windowSize.height / 2
        ),
        radius,
      })
    }

    this.airFilter.updateUniforms(airs, cameraPos)
  }

  private updateDarknessFilter(camera: Entity): void {
    const offset = camera.getComponent('Position')
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

  private updateSuffocationFilter(): void {
    const player = getSingleton('Player', this.world)
    const suffocationRate = Math.min(
      1,
      player.getComponent('AirHolder').suffocationDamageCount / SUFFOCATION_DAMAGE_INTERVAL
    )
    this.suffocationFilter.updateUniforms(suffocationRate)
  }

  private updateSearcher(camera: Entity): void {
    const cameraPos = camera.getComponent('Position')
    const searcherPos = this.lightSearcher.getComponent('Position')
    searcherPos.x = cameraPos.x - windowSize.width / 2
    searcherPos.y = cameraPos.y - windowSize.height / 2
  }
}
