import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { SpeechBalloonFactory } from '@game/entities/speechBalloonFactory'
import { KeyController } from '@game/systems/controlSystem'

export const talk = function* (entity: Entity, world: World): Behaviour<void> {
  const talk = (serif: string): void => {
    world.addEntity(
      new SpeechBalloonFactory(serif, entity, world, {
        fontSize: 8,
        tint: 0x000000,
        waitForEnd: wait.frame(100),
      }).create()
    )
  }
  while (true) {
    if (KeyController.isKeyPressed('X')) {
      talk('おににかなぼう\nかわいいこにはたびをさせよ\nうまのみみにねんぶつ')
    }
    if (KeyController.isKeyPressed('C')) {
      talk(
        'いろはにほへどちりぬるを\nわかよたれそつねならむ\nうゐのおくやまけふこえて\nあさきゆめみしゑひもせす'
      )
    }
    if (KeyController.isKeyPressed('V')) {
      talk('Windows　でコンピュータのせかいがひろがります。')
    }
    if (KeyController.isKeyPressed('B')) {
      talk(
        'イロハニホヘドチリヌルヲ\nワカヨタレソツネナラム\nウヰノオクヤマケフコエテ\nアサキユメミシヱヒモセス'
      )
    }
    yield
  }
}
