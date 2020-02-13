/* 
  Hold the total count of frames since the game started
  this class needed to detect the frame when the key is pressed
 */
export default class FrameCounter {
  static frameCount = 0
  static update(): void {
    this.frameCount++
  }
  static getCount(): number {
    return this.frameCount
  }
}
