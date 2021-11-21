import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { chaseCameraAI } from '@game/ai/entity/camera/chaseCameraAI'
import { CameraFactory } from '@game/entities/cameraFactory'
import { LaserSightFactory } from '@game/entities/laserSightFactory'
import { assert } from '@utils/assertion'
import { StageName } from './stageLoader'

export type SpawnerID = number

export class Stage {
  private playerSpanwners = new Map<SpawnerID, Vec2>()

  public constructor(public readonly stageName: StageName, private world: World) {}

  public registerSpawner(id: SpawnerID, pos: Vec2): void {
    assert(this.playerSpanwners.has(id) === false, `Multiple player spawner ID detected: ${id}`)
    this.playerSpanwners.set(id, pos)
  }

  public spawnPlayer(player: Entity, id: SpawnerID): void {
    const pos = this.playerSpanwners.get(id)
    assert(pos, `player spawner ID '${id}' is not found`)

    player.getComponent('Position').assign(pos)
    const camera = new CameraFactory().create()
    camera.getComponent('Camera').aiStack.push(chaseCameraAI(camera, player))
    this.world.addEntity(player)
    this.world.addEntity(new LaserSightFactory(this.world).create())
    this.world.addEntity(player.getComponent('Player').ui)
    this.world.addEntity(camera)
  }
}
