import { windowSize } from '@core/application'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { getTexture, toSpriteName } from '@core/graphics/art'
import { Vec2 } from '@core/math/vec2'
import { inventoryItemCursorAI } from '@game/ai/entity/inventoryItemCursor/inventoryItemCursorAI'
import { AiComponent } from '@game/components/aiComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { EntityName, loadEntity } from '@game/entities/loader/EntityLoader'
import { TextFactory } from '@game/entities/textFactory'
import { useItem } from '@game/item/useItem'
import { MouseButton } from '@game/systems/controlSystem'
import { EventNotifier } from '@utils/eventNotifier'
import { BitmapText, Sprite } from 'pixi.js'
import { ItemName } from './item'
import { ItemSetting, itemURL } from './itemURL'

type FocusItemNotifier = EventNotifier<number>
type FocusItemReceiver = EventNotifier<ItemSetting | undefined>
type ChangeItemListNotifier = EventNotifier<ItemName[]>
type SelectItemNotifier = EventNotifier<[MouseButton, number]>

const OFFSET_Y = 24

const createBackground = (): Entity => {
  const entity = loadEntity('inventoryBackground')
  entity.addComponent(
    'Position',
    new PositionComponent(windowSize.width / 2, windowSize.height / 2 + OFFSET_Y)
  )
  return entity
}

const createItemFrame = (arg: {
  name: EntityName
  position: PositionComponent
  receiver: FocusItemReceiver
}): Entity => {
  const entity = loadEntity(arg.name)
  entity.addComponent('Position', arg.position)

  const sprite = new Sprite()
  sprite.anchor.set(0.5)
  entity.getComponent('Draw').addChild(sprite)

  arg.receiver.addObserver((item?: ItemSetting): void => {
    if (item !== undefined) {
      sprite.texture = getTexture(toSpriteName(item.spriteName))
      sprite.visible = true
    } else {
      sprite.visible = false
    }
  })

  return entity
}

const createItemName = (notifier: FocusItemReceiver): Entity => {
  const entity = new TextFactory({
    fontSize: 16,
    pos: new Vec2(130, 50 + OFFSET_Y),
    tint: 0x000000,
  }).create()
  notifier.addObserver((item?: ItemSetting): void => {
    const [bitmapText] = entity.getComponent('Draw').children as [BitmapText]
    bitmapText.text = item?.displayName ?? ''
  })
  return entity
}

const createItemDescription = (notifier: FocusItemReceiver): Entity => {
  const entity = new TextFactory({
    fontSize: 8,
    pos: new Vec2(130, 75 + OFFSET_Y),
    tint: 0x000000,
  }).create()
  notifier.addObserver((item?: ItemSetting): void => {
    const [bitmapText] = entity.getComponent('Draw').children as [BitmapText]
    bitmapText.text = item?.description ?? ''
  })
  return entity
}

const createInventoryItemSmallFrames = (
  focusItemNotifier: FocusItemNotifier,
  selectItemNotifier: SelectItemNotifier,
  changeItemListNotifier: ChangeItemListNotifier
): Array<Entity> => {
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

  const result = []
  for (let row = 0; row < ROW_NUM; row++) {
    for (let col = 0; col < COL_NUM; col++) {
      const index = result.length
      const receiver = changeItemListNotifier.map(
        (itemNames: ItemName[]): ItemSetting | undefined => itemURL[itemNames[index]]
      )
      const entity = createItemFrame({
        name: 'inventoryItemFrameSmall',
        position: new PositionComponent(
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
          ) + OFFSET_Y
        ),
        receiver,
      })
      entity.addComponent(
        'Ai',
        new AiComponent({
          behaviour: inventoryItemCursorAI(
            entity,
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
      result.push(entity)
    }
  }
  return result
}

export const createInventoryUI = (world: World, playerEntity: Entity): void => {
  const player = playerEntity.getComponent('Player')
  const focusItemNotifier = new EventNotifier<number>()
  const focusItemReceiver = focusItemNotifier.map(
    (index: number): ItemSetting | undefined => itemURL[player.itemList[index]]
  )
  const selectItemNotifier = new EventNotifier<[MouseButton, number]>()
  const changeItemListNotifier = new EventNotifier<ItemName[]>()

  selectItemNotifier.addObserver((arg: [MouseButton, number]): void => {
    const [button, index] = arg
    if (index >= player.itemList.length) return
    switch (button) {
      case 'Left':
        useItem(player.popItem(index), playerEntity)
        break
      case 'Right':
        player.popItem(index)
        break
      default:
        return
    }
    changeItemListNotifier.notify(player.itemList)
    focusItemNotifier.notify(index)
  })

  const background = createBackground()
  const itemName = createItemName(focusItemReceiver)
  const itemDescription = createItemDescription(focusItemReceiver)
  const largeFrame = createItemFrame({
    name: 'inventoryItemFrameLarge',
    position: new PositionComponent(90, 80 + OFFSET_Y),
    receiver: focusItemReceiver,
  })
  const smallFrames = createInventoryItemSmallFrames(
    focusItemNotifier,
    selectItemNotifier,
    changeItemListNotifier
  )

  world.addEntity(background)
  world.addEntity(itemName)
  world.addEntity(itemDescription)
  world.addEntity(largeFrame)
  world.addEntity(...smallFrames)

  changeItemListNotifier.notify(player.itemList)
}
