import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { HorizontalDirection } from '@game/components/horizontalDirectionComponent'
import { KeyController } from '@game/systems/controlSystem'
import { PLAYER_SETTING } from '../playerAI'

type WalkAction =
  | {
      walking: true
      looking: HorizontalDirection
    }
  | {
      walking: false
    }

const decideAction = (): WalkAction => {
  if (KeyController.isActionPressing('MoveLeft')) return { walking: true, looking: 'Left' }
  if (KeyController.isActionPressing('MoveRight')) return { walking: true, looking: 'Right' }
  return { walking: false }
}

export const walk = function*(entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')
  const animState = entity.getComponent('AnimationState')
  const direction = entity.getComponent('HorizontalDirection')

  const body = entity.getComponent('RigidBody')
  let t = 0
  let s = 0
  const footSounds = ['foot1', 'foot2', 'foot3', 'foot4']

  const soundFoot = (): void => {
    if (t++ % 8 == 0) entity.getComponent('Sound').addSound(footSounds[s++ % 4])
  }

  while (true) {
    const action = decideAction()
    // const normal = player.ground.landing ? player.ground.normal : new Vec2(0, -1)
    const normal = new Vec2(0, -1)
    if (action.walking) {
      const dir = ((): Vec2 => {
        switch (action.looking) {
          case 'Left':
            return new Vec2(+normal.y, -normal.x)
          case 'Right':
            return new Vec2(-normal.y, +normal.x)
        }
      })()
      const vel = body.velocity.dot(dir)
      const dif = Math.min(PLAYER_SETTING.normal.walk.power, PLAYER_SETTING.normal.walk.speed - vel)
      body.velocity = body.velocity.add(dir.mul(dif))
      direction.looking = action.looking
      if (player.ground.landing) {
        soundFoot()
        animState.state = 'Walking'
      }
    } else {
      let tan = new Vec2(-normal.y, +normal.x)
      let vel = body.velocity.dot(tan)
      if (vel < 0) {
        tan = tan.mul(-1)
        vel *= -1
      }
      const dif = Math.max(vel - PLAYER_SETTING.normal.walk.power, 0) - vel

      body.velocity = body.velocity.add(tan.mul(dif))

      if (player.ground.landing) animState.state = 'Standing'
    }
    yield
  }
}
