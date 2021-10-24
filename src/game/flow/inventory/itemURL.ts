/*+. NOTIFICATION .+*/
// this file is automatically written by script.
// you can update this file by type "yarn metabuild" command.

import testItem from '@res/item/testItem.json'

export type ItemSetting = {
  name: string
  displayName: string
  description: string
  spriteName: string
}

export const itemURL: { [key: string]: ItemSetting } = {
  testItem,
}
