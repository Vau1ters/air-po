import FrameCounter from './frameCounter'

export default class Input {
  public static inputedKeyList = new Array(256).fill(false)
  public static clickedKeyList = new Array(256).fill(false)
  public static frameCount = 0
  public static init(): void {
    console.log('in')
  }
  private static getKeyCode(keyName: string): number {
    switch (keyName) {
      case 'Z':
        return 90
      case 'X':
        return 88
      case 'C':
        return 67
      case 'V':
        return 86
      case 'H':
        return 72
      case 'J':
        return 74
      case 'K':
        return 75
      case 'L':
        return 76
      case 'LEFT':
        return 37
      case 'UP':
        return 38
      case 'RIGHT':
        return 39
      case 'DOWN':
        return 40
      case 'SPACE':
        return 32
      case 'SHIFT':
        return 16
      case 'ESC':
        return 27
      default:
        return -1
    }
  }
  /*押下状態のときtrue*/
  public static isKeyInput(keyName: string): boolean {
    return this.inputedKeyList[this.getKeyCode(keyName)]
  }
  /*押された瞬間のみture*/
  public static isKeyClick(keyName: string): boolean {
    if (this.frameCount == FrameCounter.getCount()) {
      return this.clickedKeyList[this.getKeyCode(keyName)]
    } else {
      return false
    }
  }
}

window.addEventListener('keydown', e => {
  Input.clickedKeyList[e.keyCode] = false
  if (!Input.inputedKeyList[e.keyCode]) {
    Input.clickedKeyList[e.keyCode] = true
    Input.frameCount = FrameCounter.getCount()
  }
  Input.inputedKeyList[e.keyCode] = true
})
window.addEventListener('keyup', e => {
  Input.clickedKeyList[e.keyCode] = false
  Input.inputedKeyList[e.keyCode] = false
})
