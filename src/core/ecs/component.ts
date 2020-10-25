import { PositionComponent } from '../../game/components/positionComponent'
import { RigidBodyComponent } from '../../game/components/rigidBodyComponent'
import { ColliderComponent } from '../../game/components/colliderComponent'
import { DrawComponent } from '../../game/components/drawComponent'
import { PlayerComponent } from '../../game/components/playerComponent'
import { BulletComponent } from '../../game/components/bulletComponent'
import { HorizontalDirectionComponent } from '../../game/components/directionComponent'
import { AirComponent } from '../../game/components/airComponent'
import { AirHolderComponent } from '../../game/components/airHolderComponent'
import { AIComponent } from '../../game/components/aiComponent'
import { HPComponent } from '../../game/components/hpComponent'
import { AttackComponent } from '../../game/components/attackComponent'
import { InvincibleComponent } from '../../game/components/invincibleComponent'
import { CameraComponent } from '../../game/components/cameraComponent'
import { AnimationStateComponent } from '../../game/components/animationStateComponent'
import { VineComponent } from '../../game/components/vineComponent'
import { PickupTargetComponent } from '../../game/components/pickupTargetComponent'
import { LightComponent } from '../../game/components/lightComponent'
import { StaticComponent } from '../../game/components/staticComponent'

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
