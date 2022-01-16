import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { ease } from '@core/behaviour/easing/easing'
import { Out } from '@core/behaviour/easing/functions'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Movie } from '@game/movie/movie'
import { Graphics } from 'pixi.js'
import { cameraActionAI } from './cameraActionAI'
import { moveActionAI } from './moveActionAI'
import { showSpriteActionAI } from './showSpriteActionAI'
import { talkActionAI } from './talkActionAI'

const effect = function* (g: Graphics, option: { from: number; to: number }): Behaviour<void> {
  yield* ease(Out.quad)(
    150,
    (value: number): void => {
      const height = windowSize.height * 0.1 * value
      g.clear()
      g.beginFill(0x000000)
      g.drawRect(0, 0, windowSize.width, height)
      g.drawRect(0, windowSize.height - height, windowSize.width, height)
      g.endFill()
    },
    option
  )
}

export const movieAI = function* (movie: Movie, g: Graphics, world: World): Behaviour<void> {
  const nameFamily = new FamilyBuilder(world).include('Name').build()
  yield* effect(g, { from: 0, to: 1 })
  for (const action of movie) {
    switch (action.action) {
      case 'camera':
        yield* cameraActionAI(action, world, nameFamily)
        break
      case 'talk':
        yield* talkActionAI(action, world, nameFamily)
        break
      case 'move':
        yield* moveActionAI(action, nameFamily)
        break
      case 'showSprite':
        yield* showSpriteActionAI(action, world, nameFamily)
        break
    }
  }
  yield* effect(g, { from: 1, to: 0 })
}
