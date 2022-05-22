import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { getTexture, toSpriteName } from '@core/graphics/art'
import { inventoryItemCursorAI } from '@game/ai/entity/inventoryItemCursor/inventoryItemCursorAI'
import { AiComponent } from '@game/components/aiComponent'
import { loadUi } from '@game/entities/ui/loader/uiLoader'
import { Item } from '@game/item/item'
import { MouseButton } from '@game/systems/controlSystem'
import { EventNotifier } from '@utils/eventNotifier'
import { BitmapText, Graphics, Sprite } from 'pixi.js'

type FocusItemReceiver = EventNotifier<Item | undefined>

const setupAsItemFrame = (entity: Entity, receiver: FocusItemReceiver): void => {
  const draw = entity.getComponent('Draw')

  const textureHolder = new Sprite()
  textureHolder.anchor.set(0.5)
  draw.addChild(textureHolder)

  const blackSheet = new Graphics()
  blackSheet.beginFill(0, 0.5)
  blackSheet.drawRect(-16, -16, 32, 32)
  blackSheet.endFill()
  blackSheet.visible = false
  draw.addChild(blackSheet)

  receiver.addObserver((item?: Item): void => {
    if (item !== undefined) {
      textureHolder.texture = getTexture(toSpriteName(item.setting.spriteName))
      textureHolder.visible = true
      blackSheet.visible = !item.canUse()
    } else {
      textureHolder.visible = false
      blackSheet.visible = false
    }
  })
}

export const createInventoryUI = (world: World, playerEntity: Entity): void => {
  const player = playerEntity.getComponent('Player')
  const focusItemNotifier = new EventNotifier<number>()
  const focusItemReceiver = focusItemNotifier.map(
    (index: number): Item | undefined => player.itemList[index]
  )
  const selectItemNotifier = new EventNotifier<[MouseButton, number]>()
  const changeItemListNotifier = new EventNotifier<Item[]>()

  selectItemNotifier.addObserver((arg: [MouseButton, number]): void => {
    const [button, index] = arg
    if (index >= player.itemList.length) return
    switch (button) {
      case 'Left': {
        const item = player.itemList[index]
        if (item.canUse()) {
          player.popItem(index).use()
        }
        break
      }
      case 'Right':
        player.popItem(index)
        break
      default:
        return
    }
    changeItemListNotifier.notify(player.itemList)
    focusItemNotifier.notify(index)
  })

  const ui = loadUi('inventory', world)
  const itemName = ui.get('itemName')
  const itemDescription = ui.get('itemDescription')
  const itemFrameLarge = ui.get('itemFrameLarge')
  const itemFrameSmall = ui.get('itemFrameSmall')
  focusItemReceiver.addObserver((item?: Item): void => {
    const [bitmapText] = itemName.getComponent('Draw').children as [BitmapText]
    bitmapText.text = item?.setting?.displayName ?? ''
  })
  focusItemReceiver.addObserver((item?: Item): void => {
    const [bitmapText] = itemDescription.getComponent('Draw').children as [BitmapText]
    bitmapText.text = item?.setting?.description ?? ''
  })

  setupAsItemFrame(
    itemFrameLarge,
    focusItemReceiver.filter((item?: Item): boolean => item?.canUse() ?? false)
  )
  for (const [index, frame] of itemFrameSmall.getComponent('TileLayout').entities.entries()) {
    const changeItemReceiver = changeItemListNotifier.map(
      (items: Item[]): Item | undefined => items[index]
    )
    setupAsItemFrame(frame, changeItemReceiver)
    frame.addComponent(
      'Ai',
      new AiComponent(frame, {
        behaviour: inventoryItemCursorAI(
          frame,
          (): void => focusItemNotifier.notify(index),
          (button: MouseButton): void => {
            selectItemNotifier.notify([button, index])
          }
        ),
        dependency: {
          before: ['ControlSystem:update'],
          after: ['CollisionSystem:update'],
        },
      })
    )
  }

  changeItemListNotifier.notify(player.itemList)
}
