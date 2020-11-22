import { Behaviour } from '@core/behaviour/behaviour'

export const airEffectBehaviour = function*(): Behaviour<void> {
  function update(): void {
    console.log('air')
  }

  while (true) {
    update()
    yield
  }
}
