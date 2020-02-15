import { PositionComponent } from '../components/positionComponent'
import { VelocityComponent } from '../components/velocityComponent'

export interface ComponentMap {
  Position: PositionComponent
  Velocity: VelocityComponent
}

export type ComponentName = keyof ComponentMap
