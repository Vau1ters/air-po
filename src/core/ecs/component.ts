import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { ColliderComponent } from '../components/colliderComponent'
import { DrawComponent } from '../components/drawComponent'
import { PlayerComponent } from '../components/playerComponent'
import { HorizontalDirectionComponent } from '../components/directionComponent'
import { AirComponent } from '../components/airComponent'

export interface ComponentMap {
  Position: PositionComponent
  RigidBody: RigidBodyComponent
  Collider: ColliderComponent
  Draw: DrawComponent
  Player: PlayerComponent
  HorizontalDirection: HorizontalDirectionComponent
  Air: AirComponent
}

export type ComponentName = keyof ComponentMap
