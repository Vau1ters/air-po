import { windowSize } from '@core/application'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { getTexture, toSpriteName } from '@core/graphics/art'
import { Vec2 } from '@core/math/vec2'
import { PositionComponent } from '@game/components/positionComponent'
import { InventoryItemFrameFactory } from '@game/entities/inventoryItemFrameFactory'
import { loadEntity } from '@game/entities/loader/EntityLoader'
import { TextFactory } from '@game/entities/textFactory'
import { MouseButton } from '@game/systems/controlSystem'
import { BitmapText, Sprite } from 'pixi.js'
import { itemURL } from './itemURL'

export class InventoryUI {
  private readonly inventoryItemFrameLarge: Entity
  private readonly inventoryItemFrameSmallList: Array<Entity> = []
  private readonly itemName: Entity
  private readonly itemDescription: Entity

  constructor(world: World, private player: Entity) {
    const background = loadEntity('inventoryBackground')
    background.addComponent(
      'Position',
      new PositionComponent(windowSize.width / 2, windowSize.height / 2)
    )
    world.addEntity(background)

    this.inventoryItemFrameLarge = loadEntity('inventoryItemFrameLarge')
    this.inventoryItemFrameLarge.addComponent('Position', new PositionComponent(90, 80))
    world.addEntity(this.inventoryItemFrameLarge)

    const WINDOW_WIDTH = getTexture('inventoryBackground').width
    const WINDOW_HEIGHT = getTexture('inventoryBackground').height
    const FRAME_WIDTH = getTexture('inventoryItemFrameSmall').width
    const FRAME_HEIGHT = getTexture('inventoryItemFrameSmall').height
    const ROW_NUM = 2
    const COL_NUM = 5
    // WINDOW_WIDTH = MARGIN_X * (COL_NUM + 1) + FRAME_WIDTH * COL_NUM
    const MARGIN_X = (WINDOW_WIDTH - FRAME_WIDTH * COL_NUM) / (COL_NUM + 1)
    // WINDOW_HEIGHT / 2 = MARGIN_Y * (ROW_NUM + 1) + FRAME_HEIGHT * ROW_NUM
    const MARGIN_Y = (WINDOW_HEIGHT / 2 - FRAME_HEIGHT * ROW_NUM) / (ROW_NUM + 1)

    for (let row = 0; row < ROW_NUM; row++) {
      for (let col = 0; col < COL_NUM; col++) {
        const index = this.inventoryItemFrameSmallList.length
        const inventoryItemFrameSmall = new InventoryItemFrameFactory()
          .setPos(
            new Vec2(
              Math.floor(
                windowSize.width / 2 -
                  WINDOW_WIDTH / 2 +
                  MARGIN_X * (col + 1) +
                  FRAME_WIDTH * col +
                  FRAME_WIDTH / 2
              ),
              Math.floor(
                windowSize.height / 2 +
                  WINDOW_HEIGHT / 4 +
                  MARGIN_Y * (row - ROW_NUM / 2 + 1) +
                  FRAME_HEIGHT * (row - ROW_NUM / 2)
              )
            )
          )
          .onFocus((): void => {
            this.onFocus(index)
          })
          .onClick((button: MouseButton): void => {
            const player = this.player.getComponent('Player')
            if (index >= player.itemList.length) return
            switch (button) {
              case 'Left':
                player.useItem(index)
                this.updateItemList()
                break
              case 'Right':
                player.discardItem(index)
                this.updateItemList()
                break
            }
            this.onFocus(index)
          })
          .create()
        this.inventoryItemFrameSmallList.push(inventoryItemFrameSmall)
        world.addEntity(inventoryItemFrameSmall)
      }
    }

    this.itemName = new TextFactory({
      fontSize: 16,
      pos: new Vec2(130, 50),
      tint: 0x000000,
    }).create()
    world.addEntity(this.itemName)

    this.itemDescription = new TextFactory({
      fontSize: 8,
      pos: new Vec2(130, 75),
      tint: 0x000000,
    }).create()
    world.addEntity(this.itemDescription)

    this.updateItemList()
  }

  updateItemList(): void {
    const itemList = this.player.getComponent('Player').itemList
    for (let i = 0; i < this.inventoryItemFrameSmallList.length; i++) {
      const sprite = this.inventoryItemFrameSmallList[i]
        .getComponent('Draw')
        .getChildAt(1) as Sprite
      const itemName = itemList[i]

      if (itemName !== undefined) {
        const item = itemURL[itemName]
        sprite.texture = getTexture(toSpriteName(item.spriteName))
        sprite.visible = true
      } else {
        sprite.visible = false
      }
    }
  }

  onFocus(index: number): void {
    const largeFrameDraw = this.inventoryItemFrameLarge.getComponent('Draw')
    const [itemNameText] = this.itemName.getComponent('Draw').children as [BitmapText]
    const [itemDescriptionText] = this.itemDescription.getComponent('Draw').children as [BitmapText]
    const itemList = this.player.getComponent('Player').itemList
    const itemName = itemList[index]

    if (largeFrameDraw.children.length > 1) {
      largeFrameDraw.removeChildAt(1)
      itemNameText.text = ''
      itemDescriptionText.text = ''
    }

    if (itemName !== undefined) {
      const item = itemURL[itemName]
      const texture = getTexture(toSpriteName(item.spriteName))
      const sprite = new Sprite(texture)
      sprite.anchor.set(0.5)
      largeFrameDraw.addChild(sprite)

      itemNameText.text = item.displayName
      itemDescriptionText.text = item.description
    }
  }
}
