import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { ColliderComponent } from '../components/colliderComponent'
import { DrawComponent } from '../components/drawComponent'
import { PlayerComponent } from '../components/playerComponent'
import { BulletComponent } from '../components/bulletComponent'
import { HorizontalDirectionComponent } from '../components/directionComponent'
import { AIComponent } from '../components/aiComponent'
import { HPComponent } from '../components/hpComponent'
import { AttackComponent } from '../components/attackComponent'
import { InvincibleComponent } from '../components/invincibleComponent'
import { BVHComponent } from '../components/bvhComponent'

export interface ComponentMap {
  Position: PositionComponent
  RigidBody: RigidBodyComponent
  Collider: ColliderComponent
  Draw: DrawComponent
  Player: PlayerComponent
  Bullet: BulletComponent
  HorizontalDirection: HorizontalDirectionComponent
  AI: AIComponent
  HP: HPComponent
  Invincible: InvincibleComponent
  Attack: AttackComponent
  BVH: BVHComponent
}

export type ComponentName = keyof ComponentMap
