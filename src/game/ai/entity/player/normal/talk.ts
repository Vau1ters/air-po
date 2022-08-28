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
    if (KeyController.isKeyPressed('N')) {
      talk('the quick brown fox\njumps over the lazy dog')
    }
    if (KeyController.isKeyPressed('M')) {
      talk('THE QUICK BROWN FOX\nJUMPS OVER THE LAZY DOG')
    }
    if (KeyController.isKeyPressed('L')) {
      talk('The Quick Brown Fox\nJumps Over The Lazy Dog')
    }
    yield
  }
}
