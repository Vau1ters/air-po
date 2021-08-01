import { StageName } from '@game/stage/stageLoader'

type PlayerDieEvent = {
  type: 'playerDie'
}

type MoveEvent = {
  type: 'move'
  mapName: StageName
  spawnerID: number
}

type GameEvent = PlayerDieEvent | MoveEvent

export class GameEventComponent {
  public event?: GameEvent
}
