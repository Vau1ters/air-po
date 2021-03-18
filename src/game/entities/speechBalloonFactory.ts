import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { Filter, BitmapText, Sprite } from 'pixi.js'
import speechBalloonVertexShader from '@res/shaders/speechBalloon.vert'
import speechBalloonFragmentShader from '@res/shaders/speechBalloon.frag'
import speechBalloonTextFragmentShader from '@res/shaders/speechBalloonText.frag'
import { speechBalloonAI } from '@game/ai/entity/speechBalloon/speechBalloonAI'
import { AIComponent } from '@game/components/aiComponent'
import { windowSize } from '@core/application'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'

export class SpeechBalloonFactory extends EntityFactory {
  constructor(private text: string, private target: Entity, private camera: Entity) {
    super()
  }

  create(): Entity {
    const entity = new Entity()

    const tailSize = 20
    const radius = 10
    const padding = radius / Math.sqrt(2)
    const border = 1
    const sprite = new Sprite()
    sprite.name = 'background'
    sprite.width = windowSize.width
    sprite.height = windowSize.height * 0.4
    sprite.anchor.set(0.5)
    sprite.filters = [
      new Filter(undefined, speechBalloonFragmentShader, {
        displaySize: [sprite.width, sprite.height],
        tailSize,
        radius,
        border,
      }),
    ]

    const ui = new DrawComponent({ entity, type: 'UI' })
    ui.filters = [
      new Filter(speechBalloonVertexShader, undefined, {
        anchor: [0, 0],
        scale: 0,
        angle: 0,
      }),
    ]
    ui.sortableChildren = true

    const text = new BitmapText(this.normalize(this.text), {
      fontName: 'got',
      fontSize: 8,
    })
    text.name = 'text'
    text.roundPixels = true
    text.filters = [new Filter(undefined, speechBalloonTextFragmentShader)]
    text.zIndex = 1
    text.position.set(
      tailSize + padding - sprite.width * 0.5,
      tailSize + padding - sprite.height * 0.5
    )

    ui.addChild(sprite)
    ui.addChild(text)

    entity.addComponent('Draw', ui)
    entity.addComponent('AI', new AIComponent(speechBalloonAI(entity, this.target, this.camera)))
    entity.addComponent(
      'Position',
      new PositionComponent(windowSize.width * 0.5, sprite.height * 0.5)
    )
    return entity
  }

  private normalize(text: string): string {
    const table: { [key: string]: string } = {
      が: 'か゛',
      ぎ: 'き゛',
      ぐ: 'く゛',
      げ: 'け゛',
      ご: 'こ゛',
      ざ: 'さ゛',
      じ: 'し゛',
      ず: 'す゛',
      ぜ: 'せ゛',
      ぞ: 'そ゛',
      だ: 'た゛',
      ぢ: 'ち゛',
      づ: 'つ゛',
      で: 'て゛',
      ど: 'と゛',
      ば: 'は゛',
      び: 'ひ゛',
      ぶ: 'ふ゛',
      べ: 'へ゛',
      ぼ: 'ほ゛',
      ぱ: 'は゜',
      ぴ: 'ひ゜',
      ぷ: 'ふ゜',
      ぺ: 'へ゜',
      ぽ: 'ほ゜',
      ガ: 'カ゛',
      ギ: 'キ゛',
      グ: 'ク゛',
      ゲ: 'ケ゛',
      ゴ: 'コ゛',
      ザ: 'サ゛',
      ジ: 'シ゛',
      ズ: 'ズ゛',
      ゼ: 'ゼ゛',
      ゾ: 'ゾ゛',
      ダ: 'タ゛',
      ヂ: 'チ゛',
      ヅ: 'ツ゛',
      デ: 'テ゛',
      ド: 'ト゛',
      バ: 'ハ゛',
      ビ: 'ヒ゛',
      ブ: 'フ゛',
      ベ: 'ヘ゛',
      ボ: 'ホ゛',
      パ: 'ハ゜',
      ピ: 'ヒ゜',
      プ: 'フ゜',
      ペ: 'ヘ゜',
      ポ: 'ホ゜',
    }
    let result = ''
    for (let i = 0; i < text.length; i++) {
      const c = text.charAt(i)
      if (c in table) {
        result += table[c]
      } else {
        result += c
      }
    }
    return result
  }
}
