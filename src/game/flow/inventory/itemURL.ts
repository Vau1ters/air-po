/*+. NOTIFICATION .+*/
// this file is automatically written by script.
// you can update this file by type "yarn metabuild" command.

import airHealItem from '@res/item/airHealItem.json'
import hpHealItem from '@res/item/hpHealItem.json'
import testItem from '@res/item/testItem.json'

export type ItemSetting = {
  name: string
  displayName: string
  description: string
  spriteName: string
}

export const itemURL: { [key: string]: ItemSetting } = {
  airHealItem,
  hpHealItem,
  testItem,
}
