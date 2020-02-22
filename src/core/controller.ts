export class KeyController {
  private static readonly keyPressingMap: Map<KeyCode, boolean> = new Map()

  private static readonly keyPressedMap: Map<KeyCode, boolean> = new Map()

  private static pressKey(keyCode: KeyCode): void {
    this.keyPressingMap.set(keyCode, true)
    this.keyPressedMap.set(keyCode, true)
  }

  private static releaseKey(keyCode: KeyCode): void {
    this.keyPressingMap.set(keyCode, false)
    this.keyPressedMap.set(keyCode, false)
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

  public static init(): void {
    window.addEventListener('keydown', e => {
      const key = e.key
      if (this.isKeyCode(key)) {
        this.pressKey(key)
      }
    })
    window.addEventListener('keyup', e => {
      const key = e.key
      if (this.isKeyCode(key)) {
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

  // 毎フレーム呼び出す
  public static onUpdateFinished(): void {
    for (const keyCode of this.keyPressingMap.keys()) {
      this.keyPressingMap.set(keyCode, false)
    }
  }
}
