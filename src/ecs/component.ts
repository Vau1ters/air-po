import { PositionComponent } from './components/positionComponent'
import { RigidBodyComponent } from './components/rigidBodyComponent'
import { ColliderComponent } from './components/colliderComponent'
import { DrawComponent } from './components/drawComponent'
import { PlayerComponent } from './components/playerComponent'
import { BulletComponent } from './components/bulletComponent'
import { HorizontalDirectionComponent } from './components/directionComponent'
import { AirComponent } from './components/airComponent'
import { AirHolderComponent } from './components/airHolderComponent'
import { AIComponent } from './components/aiComponent'
import { HPComponent } from './components/hpComponent'
import { AttackComponent } from './components/attackComponent'
import { InvincibleComponent } from './components/invincibleComponent'
import { CameraComponent } from './components/cameraComponent'
import { AnimationStateComponent } from './components/animationStateComponent'
import { VineComponent } from './components/vineComponent'
import { PickupTargetComponent } from './components/pickupTargetComponent'
import { LightComponent } from './components/lightComponent'
import { StaticComponent } from './components/staticComponent'

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
  Camera: CameraComponent
  AnimationState: AnimationStateComponent
  Vine: VineComponent
  PickupTarget: PickupTargetComponent
  Light: LightComponent
  Static: StaticComponent
}

export type ComponentName = keyof ComponentMap