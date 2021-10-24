import { Behaviour } from '@core/behaviour/behaviour'
import { ease } from '@core/behaviour/easing/easing'
import { convertToEaseOut, quad } from '@core/behaviour/easing/functions'
import { Entity } from '@core/ecs/entity'
import { getTexture } from '@core/graphics/art'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { MouseButton, MouseController } from '@game/systems/controlSystem'
import { Graphics } from 'pixi.js'

type State = 'On' | 'Off'
type OnFocusCallback = () => void
type OnClickCallback = (button: MouseButton) => void

const waitForChangeState = function*(
  entity: Entity,
  current: State,
  onClick: OnClickCallback
): Generator<void, State> {
  let state: State = current
  const callbacks = entity.getComponent('Collider').colliders[0].callbacks
  const callback = (arg: CollisionCallbackArgs): void => {
    if (!arg.other.tag.has('mouse')) return
    if (MouseController.isMousePressed('Left')) onClick('Left')
    if (MouseController.isMousePressed('Right')) onClick('Right')
    state = 'On'
  }
  callbacks.add(callback)

  while (true) {
    if (state !== current) break
    state = 'Off'
    yield
  }

  callbacks.delete(callback)
  return state
}

export const inventoryItemCursorAI = function*(
  entity: Entity,
  onFocusCallback: OnFocusCallback,
  onClickCallback: OnClickCallback
): Behaviour<void> {
  const cursorWidth = getTexture('inventoryItemFrameSmall').width
  const cursorHeight = getTexture('inventoryItemFrameSmall').height

  const cursor = new Graphics()
  cursor.position.set(0)
  cursor.clear()
  cursor.lineStyle(1, 0xff0000, undefined, undefined, true)
  cursor.alpha = 0
  cursor.drawRect(-cursorWidth / 2, -cursorHeight / 2, cursorWidth + 1, cursorHeight + 1)
  entity.getComponent('Draw').addChild(cursor)

  let state: State = 'Off'
  while (true) {
    state = yield* waitForChangeState(entity, state, onClickCallback)

    const easeOption = ((): { from: number; to: number } => {
      switch (state) {
        case 'On':
          return { from: 0, to: 1 }
        case 'Off':
          return { from: 1, to: 0 }
      }
    })()

    if (state === 'On') onFocusCallback()

    yield* ease(convertToEaseOut(quad))(
      10,
      (value: number): void => {
        cursor.alpha = value
        cursor.scale.set(1.2 - value * 0.2)
      },
      easeOption
    )
    yield
  }
}
