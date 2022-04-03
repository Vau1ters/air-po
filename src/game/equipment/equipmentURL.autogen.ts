/*+. NOTIFICATION .+*/
// this file is automatically written by script.
// you can update this file by type "yarn metabuild" command.

import airTank from '@res/equipment/airTank.json'
import { AirTank } from '@game/equipment/airTank'
import hpUp from '@res/equipment/hpUp.json'
import { HpUp } from '@game/equipment/hpUp'

export type EquipmentSetting = {
  name: string
}

export const equipmentURL = {
  airTank,
  hpUp,
}

export const equipmentClass = {
  airTank: AirTank,
  hpUp: HpUp,
}
