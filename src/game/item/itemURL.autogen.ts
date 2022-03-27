/*+. NOTIFICATION .+*/
// this file is automatically written by script.
// you can update this file by type "yarn metabuild" command.

import airHealItem from '@res/item/airHealItem.json'
import { AirHealItem } from '@game/item/airHealItem'
import hpHealItem from '@res/item/hpHealItem.json'
import { HpHealItem } from '@game/item/hpHealItem'
import testItem from '@res/item/testItem.json'
import { TestItem } from '@game/item/testItem'

export type ItemSetting = {
  name: string
  displayName: string
  description: string
  spriteName: string
  price: number
}

export const itemURL: { [key: string]: ItemSetting } = {
  airHealItem,
  hpHealItem,
  testItem,
}

export const itemClass = {
  airHealItem: AirHealItem,
  hpHealItem: HpHealItem,
  testItem: TestItem,
}
