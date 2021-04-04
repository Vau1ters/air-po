import { EventNotifier } from '@utils/eventNotifier'

export class ButtonComponent {
  public readonly clickEvent: EventNotifier<void> = new EventNotifier()
  public readonly mouseoverEvent: EventNotifier<void> = new EventNotifier()
  public readonly mouseoutEvent: EventNotifier<void> = new EventNotifier()
}
