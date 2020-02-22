import { PositionComponent } from '../components/positionComponent'
import { VelocityComponent } from '../components/velocityComponent'
import { ColliderComponent } from '../components/colliderComponent'

export interface ComponentMap {
  Position: PositionComponent
  Velocity: VelocityComponent
  Collider: ColliderComponent
}

export type ComponentName = keyof ComponentMap
