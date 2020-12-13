import myFont from '@res/font/myFont.fnt'
import myFontImage from '@res/font/myFont_0.png'
import { BitmapFont, Texture } from 'pixi.js'

const load = (font: string, image: string): void => {
  const texture = Texture.from(image)
  const doc = new DOMParser().parseFromString(font, 'application/xml')
  BitmapFont.install(doc, texture)
}

export const init = (): void => {
  load(myFont, myFontImage)
}
