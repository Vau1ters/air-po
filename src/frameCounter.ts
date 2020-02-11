export default class FrameCounter {
  static frameCount = 0
  static update(): void {
    this.frameCount++
  }
  static getCount(): number {
    return this.frameCount
  }
}
