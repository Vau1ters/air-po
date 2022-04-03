import { Movie } from '@game/movie/movie'
import { StagePoint } from './stagePointComponent'

type PlayerDieEvent = {
  type: 'playerDie'
}

type MoveEvent = {
  type: 'move'
  spawnPoint: StagePoint
}

type MovieEvent = {
  type: 'movie'
  movie: Movie
}

export type GameEvent = PlayerDieEvent | MoveEvent | MovieEvent

export class GameEventComponent {
  public event?: GameEvent
}
