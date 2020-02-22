import { PositionComponent } from '../components/positionComponent'
import { VelocityComponent } from '../components/velocityComponent'
import { ColliderComponent } from '../components/colliderComponent'
import { DrawComponent } from '../components/drawComponent'

export interface ComponentMap {
  Position: PositionComponent
  Velocity: VelocityComponent
  Collider: ColliderComponent
  Draw: DrawComponent
}

export type ComponentName = keyof ComponentMap
