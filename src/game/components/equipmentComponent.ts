import { EventNotifier } from '@utils/eventNotifier'

export type EquipmentTypes = 'AirTank' | 'Airgun' | 'Flamethrower'

export class EquipmentComponent {
  public airTank = {
    count: 0,
    quantity: 40,
  }
  public weapons = {
    airgun: true,
    flamethrower: true,
  }
  public equipEvent = new EventNotifier<EquipmentTypes>()
}
