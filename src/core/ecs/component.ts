import { PositionComponent } from '../components/positionComponent'
import { VelocityComponent } from '../components/velocityComponent'
import { DrawComponent } from '../components/drawComponent'
import { PlayerComponent } from '../components/playerComponent'

export interface ComponentMap {
  Position: PositionComponent
  Velocity: VelocityComponent
  Draw: DrawComponent
  Player: PlayerComponent
}

export type ComponentName = keyof ComponentMap
