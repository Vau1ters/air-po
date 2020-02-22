import { PositionComponent } from '../components/positionComponent'
import { VelocityComponent } from '../components/velocityComponent'
import { DrawComponent } from '../components/drawComponent'

export interface ComponentMap {
  Position: PositionComponent
  Velocity: VelocityComponent
  Draw: DrawComponent
}

export type ComponentName = keyof ComponentMap
