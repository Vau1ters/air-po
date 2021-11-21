import { SpawnerID } from '@game/stage/stage'
import { StageName } from '@game/stage/stageLoader'

export type SpawnPoint = {
  stageName: StageName
  spawnerID: SpawnerID
}

type PlayerDieEvent = {
  type: 'playerDie'
}

type MoveEvent = {
  type: 'move'
  spawnPoint: SpawnPoint
}

type GameEvent = PlayerDieEvent | MoveEvent

export class GameEventComponent {
  public event?: GameEvent
}
