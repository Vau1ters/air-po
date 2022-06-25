/* eslint-disable @typescript-eslint/no-empty-interface */

/*+. NOTIFICATION .+*/
// this file is automatically written by script.
// you can update this file by type "yarn metabuild" command.

import { AiComponent } from 'src/game/components/aiComponent'
import { AirComponent } from 'src/game/components/airComponent'
import { AirHolderComponent } from 'src/game/components/airHolderComponent'
import { AnimationStateComponent } from 'src/game/components/animationStateComponent'
import { AttackComponent } from 'src/game/components/attackComponent'
import { BackgroundComponent } from 'src/game/components/backgroundComponent'
import { BgmComponent } from 'src/game/components/bgmComponent'
import { BulletComponent } from 'src/game/components/bulletComponent'
import { ButtonComponent } from 'src/game/components/buttonComponent'
import { CameraComponent } from 'src/game/components/cameraComponent'
import { CheckboxComponent } from 'src/game/components/checkboxComponent'
import { ColliderComponent } from 'src/game/components/colliderComponent'
import { DrawComponent } from 'src/game/components/drawComponent'
import { GameEventComponent } from 'src/game/components/gameEventComponent'
import { HorizontalDirectionComponent } from 'src/game/components/horizontalDirectionComponent'
import { HpComponent } from 'src/game/components/hpComponent'
import { InvincibleComponent } from 'src/game/components/invincibleComponent'
import { LibraryComponent } from 'src/game/components/libraryComponent'
import { LightComponent } from 'src/game/components/lightComponent'
import { NameComponent } from 'src/game/components/nameComponent'
import { PickupTargetComponent } from 'src/game/components/pickupTargetComponent'
import { PlayerComponent } from 'src/game/components/playerComponent'
import { PositionComponent } from 'src/game/components/positionComponent'
import { RigidBodyComponent } from 'src/game/components/rigidBodyComponent'
import { SensorComponent } from 'src/game/components/sensorComponent'
import { SliderComponent } from 'src/game/components/sliderComponent'
import { SoundComponent } from 'src/game/components/soundComponent'
import { StagePointComponent } from 'src/game/components/stagePointComponent'
import { StaticComponent } from 'src/game/components/staticComponent'
import { TileLayoutComponent } from 'src/game/components/tileLayoutComponent'
export interface ComponentMap {
  Ai: AiComponent
  Air: AirComponent
  AirHolder: AirHolderComponent
  AnimationState: AnimationStateComponent
  Attack: AttackComponent
  Background: BackgroundComponent
  Bgm: BgmComponent
  Bullet: BulletComponent
  Button: ButtonComponent
  Camera: CameraComponent
  Checkbox: CheckboxComponent
  Collider: ColliderComponent
  Draw: DrawComponent
  GameEvent: GameEventComponent
  HorizontalDirection: HorizontalDirectionComponent
  Hp: HpComponent
  Invincible: InvincibleComponent
  Library: LibraryComponent
  Light: LightComponent
  Name: NameComponent
  PickupTarget: PickupTargetComponent
  Player: PlayerComponent
  Position: PositionComponent
  RigidBody: RigidBodyComponent
  Sensor: SensorComponent
  Slider: SliderComponent
  Sound: SoundComponent
  StagePoint: StagePointComponent
  Static: StaticComponent
  TileLayout: TileLayoutComponent
}

export type ComponentName = keyof ComponentMap
