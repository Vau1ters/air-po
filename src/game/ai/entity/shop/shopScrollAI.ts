import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { getTexture, toSpriteName } from '@core/graphics/art'
import { Vec2 } from '@core/math/vec2'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { loadUi, Ui } from '@game/entities/ui/loader/uiLoader'
import { ItemName } from '@game/item/item'
import { itemURL } from '@game/item/itemURL'
import { MouseController } from '@game/systems/controlSystem'
import { BitmapText, Sprite, Texture } from 'pixi.js'

const waitForMouseOver = function* (entity: Entity): Behaviour<void> {
  let isMouseOver = false
  const [collider] = entity.getComponent('Collider').colliders
  collider.callbacks.add((args: CollisionCallbackArgs): void => {
    if (!args.other.tag.has('mouse')) return
    isMouseOver = true
  })
  while (!isMouseOver) yield
}

const setText = (entity: Entity, text: string): void => {
  const [child] = entity.getComponent('Draw').children as [BitmapText]
  child.text = text
}

const setTexture = (entity: Entity, texture: Texture): void => {
  const textureHolder = new Sprite(texture)
  textureHolder.anchor.set(0.5)
  entity.getComponent('Draw').addChild(textureHolder)
}

const createItemFrames = (world: World): { items: Array<Ui>; maxWheel: number } => {
  const offsetX = 160
  const offsetY = 60
  const shiftY = 50
  const itemNames: Array<ItemName> = [
    'testItem',
    'hpHealItem',
    'testItem',
    'airHealItem',
    'testItem',
  ]
  const result = []
  for (let i = 0; i < itemNames.length; i++) {
    const itemName = itemNames[i]
    const item = itemURL[itemName]
    const ui = loadUi('shopItem', world)
    ui.offset = new Vec2(offsetX, offsetY + i * shiftY)
    setTexture(ui.get('itemFrame'), getTexture(toSpriteName(item.spriteName)))
    setText(ui.get('itemName'), item.displayName)
    setText(ui.get('itemDescription'), item.description)
    setText(ui.get('price'), `${item.price}`)
    result.push(ui)
  }
  const maxWheel = result[result.length - 1].offset.y - 180
  return { items: result, maxWheel }
}

export const shopScrollAI = function* (ui: Ui, world: World): Behaviour<void> {
  const { items, maxWheel } = createItemFrames(world)
  const background = ui.get('background')
  const track = ui.get('scrollBarTrack')
  let totalWheel = 0
  while (true) {
    yield* waitForMouseOver(background)
    const nextTotalWheel = Math.max(
      0,
      Math.min(maxWheel, totalWheel + MouseController.wheel * 0.05)
    )
    const deltaWheel = nextTotalWheel - totalWheel
    totalWheel = nextTotalWheel
    for (const target of items) {
      target.offset = target.offset.add(new Vec2(0, -deltaWheel))
    }
    track.getComponent('Position').y = windowSize.height / 2 - 70 + (totalWheel / maxWheel) * 140
    yield
  }
}
