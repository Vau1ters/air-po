import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { KeyController } from '@game/systems/controlSystem'
import { speak } from '../../common/action/speak'

export const talk = function* (entity: Entity, world: World): Behaviour<void> {
  while (true) {
    if (KeyController.isKeyPressed('X')) {
      speak(entity, 'おににかなぼう\nかわいいこにはたびをさせよ\nうまのみみにねんぶつ', world)
    }
    if (KeyController.isKeyPressed('C')) {
      speak(
        entity,
        'いろはにほへどちりぬるを\nわかよたれそつねならむ\nうゐのおくやまけふこえて\nあさきゆめみしゑいもせす',
        world
      )
    }
    if (KeyController.isKeyPressed('V')) {
      speak(entity, 'Windows　でコンピュータのせかいがひろがります。', world)
    }
    yield
  }
}
