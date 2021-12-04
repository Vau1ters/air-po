import { StagePoint } from './stagePointComponent'

type PlayerDieEvent = {
  type: 'playerDie'
}

type MoveEvent = {
  type: 'move'
  spawnPoint: StagePoint
}

type GameEvent = PlayerDieEvent | MoveEvent

export class GameEventComponent {
  public event?: GameEvent
}
