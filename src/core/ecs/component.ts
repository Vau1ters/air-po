import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { ColliderComponent } from '../components/colliderComponent'
import { DrawComponent } from '../components/drawComponent'
import { PlayerComponent } from '../components/playerComponent'
import { BulletComponent } from '../components/bulletComponent'
import { HorizontalDirectionComponent } from '../components/directionComponent'
import { AirComponent } from '../components/airComponent'
import { AirHolderComponent } from '../components/airHolderComponent'
import { AIComponent } from '../components/aiComponent'
import { HPComponent } from '../components/hpComponent'
import { AttackComponent } from '../components/attackComponent'
import { InvincibleComponent } from '../components/invincibleComponent'
import { BVHComponent } from '../components/bvhComponent'
import { CameraComponent } from '../components/cameraComponent'

export interface ComponentMap {
  Position: PositionComponent
  RigidBody: RigidBodyComponent
  Collider: ColliderComponent
  Draw: DrawComponent
  Player: PlayerComponent
  Bullet: BulletComponent
  HorizontalDirection: HorizontalDirectionComponent
  Air: AirComponent
  AirHolder: AirHolderComponent
  AI: AIComponent
  HP: HPComponent
  Invincible: InvincibleComponent
  Attack: AttackComponent
  BVH: BVHComponent
  Camera: CameraComponent
}

export type ComponentName = keyof ComponentMap
