import { System } from '../system'
import { World } from '../world'

export type KeyActionType = 'MoveLeft' | 'MoveRight' | 'MoveUp' | 'MoveDown' | 'Jump' | 'Jet'
export const KeyConfig: { [K in KeyActionType]: KeyCode } = {
  MoveLeft: 'A',
  MoveRight: 'D',
  MoveUp: 'W',
  MoveDown: 'S',
  Jump: 'W',
  Jet: 'Shift',
}

export class KeyController {
  private static readonly keyPressingMap: Map<KeyCode, boolean> = new Map()

  private static readonly keyPressedMap: Map<KeyCode, boolean> = new Map()

  private static pressKey(keyCode: KeyCode): void {
    if (!this.keyPressingMap.get(keyCode)) {
      this.keyPressedMap.set(keyCode, true)
    }
    this.keyPressingMap.set(keyCode, true)
  }

  private static releaseKey(keyCode: KeyCode): void {
    this.keyPressingMap.set(keyCode, false)
    this.keyPressedMap.set(keyCode, false)
  }

  private static parseString(s: string): string {
    let k = s
    if (k.length === 1) k = k.toUpperCase()
    if (k === ' ') k = 'Space'
    k = k.replace(/Arrow/, '')
    return k
  }

  private static isKeyCode(s: string): s is KeyCode {
    return (
      s == 'A' ||
      s == 'B' ||
      s == 'C' ||
      s == 'D' ||
      s == 'E' ||
      s == 'F' ||
      s == 'G' ||
      s == 'H' ||
      s == 'I' ||
      s == 'J' ||
      s == 'K' ||
      s == 'L' ||
      s == 'M' ||
      s == 'N' ||
      s == 'O' ||
      s == 'P' ||
      s == 'Q' ||
      s == 'R' ||
      s == 'S' ||
      s == 'T' ||
      s == 'U' ||
      s == 'V' ||
      s == 'W' ||
      s == 'X' ||
      s == 'Y' ||
      s == 'Z' ||
      s == 'Space' ||
      s == 'Up' ||
      s == 'Down' ||
      s == 'Left' ||
      s == 'Right' ||
      s == 'Shift' ||
      s == 'Control' ||
      s == 'Alt' ||
      s == 'Enter' ||
      s == 'Escape'
    )
  }

  private static stringToKeyCode(s: string): KeyCode | undefined {
    const k = this.parseString(s)
    if (this.isKeyCode(k)) {
      return k
    }
    return undefined
  }

  public static init(): void {
    window.addEventListener('keydown', e => {
      const key = this.stringToKeyCode(e.key)
      if (key) {
        this.pressKey(key)
      }
    })
    window.addEventListener('keyup', e => {
      const key = this.stringToKeyCode(e.key)
      if (key) {
        this.releaseKey(key)
      }
    })
  }

  public static isKeyPressed(keyCode: KeyCode): boolean {
    return !!this.keyPressedMap.get(keyCode)
  }

  public static isKeyPressing(keyCode: KeyCode): boolean {
    return !!this.keyPressingMap.get(keyCode)
  }

  public static isActionPressed(action: KeyActionType): boolean {
    return KeyController.isKeyPressed(KeyConfig[action])
  }

  public static isActionPressing(action: KeyActionType): boolean {
    return KeyController.isKeyPressing(KeyConfig[action])
  }

  // 毎フレーム呼び出す
  public static onUpdateFinished(): void {
    for (const keyCode of this.keyPressedMap.keys()) {
      this.keyPressedMap.set(keyCode, false)
    }
  }
}

export type MouseButton = 'Left' | 'Middle' | 'Right'

export class MouseController {
  private static readonly mousePressingMap: Map<MouseButton, boolean> = new Map()

  private static readonly mousePressedMap: Map<MouseButton, boolean> = new Map()

  private static pressMouse(button: MouseButton): void {
    if (!this.mousePressingMap.get(button)) {
      this.mousePressedMap.set(button, true)
    }
    this.mousePressingMap.set(button, true)
  }

  private static releaseMouse(button: MouseButton): void {
    this.mousePressingMap.set(button, false)
    this.mousePressedMap.set(button, false)
  }

  private static numberToMouseButton(button: number): MouseButton | undefined {
    switch (button) {
      case 0:
        return 'Left'
      case 1:
        return 'Middle'
      case 2:
        return 'Right'
      default:
        return
    }
  }

  public static init(): void {
    window.addEventListener('mousedown', e => {
      const button = MouseController.numberToMouseButton(e.button)
      if (button) {
        this.pressMouse(button)
      }
    })
    window.addEventListener('mouseup', e => {
      const button = MouseController.numberToMouseButton(e.button)
      if (button) {
        this.releaseMouse(button)
      }
    })
  }

  public static isMousePressed(button: MouseButton): boolean {
    return !!this.mousePressedMap.get(button)
  }

  public static isMousePressing(button: MouseButton): boolean {
    return !!this.mousePressingMap.get(button)
  }

  // 毎フレーム呼び出す
  public static onUpdateFinished(): void {
    for (const button of this.mousePressedMap.keys()) {
      this.mousePressedMap.set(button, false)
    }
  }
}

export class ControlSystem extends System {
  public constructor(world: World) {
    super(world)

    KeyController.init()
    MouseController.init()
  }

  public update(): void {
    KeyController.onUpdateFinished()
    MouseController.onUpdateFinished()
  }
}