import { System } from '../ecs/system'
import { World } from '../ecs/world'
import { Container } from 'pixi.js'
import { AirFilter } from '../../filters/airFilter'
import { DarknessFilter } from '../../filters/darknessFilter'
import { windowSize } from '../application'
import { AirSystem } from './airSystem'

export class FilterSystem extends System {
  private airSystem: AirSystem
  private airFilter: AirFilter
  private darknessFilter: DarknessFilter

  public constructor(world: World, container: Container, airSytem: AirSystem) {
    super(world)
    this.airSystem = airSytem
    this.airFilter = new AirFilter(world, { x: windowSize.width, y: windowSize.height })
    this.darknessFilter = new DarknessFilter()
    container.filters = [this.airFilter, this.darknessFilter]
  }

  public update(): void {
    this.airFilter.airs = this.airSystem.airs
  }
}
