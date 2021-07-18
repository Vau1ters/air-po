/*+. NOTIFICATION .+*/
// this file is automatically written by script.
// you can update this file by type "yarn buildResource" command.

import { AIComponent } from '@game/components/aiComponent'
import { AirComponent } from '@game/components/airComponent'
import { AirHolderComponent } from '@game/components/airHolderComponent'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import { AttackComponent } from '@game/components/attackComponent'
import { BulletComponent } from '@game/components/bulletComponent'
import { ButtonComponent } from '@game/components/buttonComponent'
import { CameraComponent } from '@game/components/cameraComponent'
import { ColliderComponent } from '@game/components/colliderComponent'
import { HorizontalDirectionComponent } from '@game/components/directionComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { EquipmentComponent } from '@game/components/equipmentComponent'
import { HPComponent } from '@game/components/hpComponent'
import { InvincibleComponent } from '@game/components/invincibleComponent'
import { LightComponent } from '@game/components/lightComponent'
import { PickupTargetComponent } from '@game/components/pickupTargetComponent'
import { PlayerComponent } from '@game/components/playerComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { SensorComponent } from '@game/components/sensorComponent'
import { SoundComponent } from '@game/components/soundComponent'
import { StaticComponent } from '@game/components/staticComponent'
import { VineComponent } from '@game/components/vineComponent'

export interface ComponentMap {
  AI: AIComponent
  Air: AirComponent
  AirHolder: AirHolderComponent
  AnimationState: AnimationStateComponent
  Attack: AttackComponent
  Bullet: BulletComponent
  Button: ButtonComponent
  Camera: CameraComponent
  Collider: ColliderComponent
  HorizontalDirection: HorizontalDirectionComponent
  Draw: DrawComponent
  Equipment: EquipmentComponent
  HP: HPComponent
  Invincible: InvincibleComponent
  Light: LightComponent
  PickupTarget: PickupTargetComponent
  Player: PlayerComponent
  Position: PositionComponent
  RigidBody: RigidBodyComponent
  Sensor: SensorComponent
  Sound: SoundComponent
  Static: StaticComponent
  Vine: VineComponent
}

export type ComponentName = keyof ComponentMap
