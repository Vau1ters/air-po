import { EventNotifier } from '../core/eventNotifier'
import { ProceduralPromise } from './proceduralPromise'

export class TimerManager {
  private static readonly timers: Set<Timer> = new Set()

  public static update(): void {
    this.timers.forEach(timer => timer.update())
  }

  public static addTimer(timer: Timer): void {
    this.timers.add(timer)
  }

  public static deleteTimer(timer: Timer): void {
    this.timers.delete(timer)
  }
}

export default class Timer {
  private _now = 0
  private _duration: number
  private _isRunning = false
  private _promise: ProceduralPromise<void>
  private readonly updateEvent: EventNotifier<number>
  private readonly finishEvent: EventNotifier<void>

  public constructor(duration = Infinity) {
    this._duration = duration
    this.updateEvent = new EventNotifier()
    this.finishEvent = new EventNotifier()
    this._promise = new ProceduralPromise()
    this.onFinish(() => this._promise.resolve())

    TimerManager.addTimer(this)
  }

  public get now(): number {
    return this._now
  }

  public get duration(): number {
    return this._duration
  }

  public set duration(duration: number) {
    this._duration = duration
  }

  public get isRunning(): boolean {
    return !this.isDone && this._isRunning
  }

  public get isDone(): boolean {
    return this.now > this.duration
  }

  public start(): this {
    this._isRunning = true
    return this
  }

  public stop(): this {
    this._isRunning = false
    return this
  }

  public update(): void {
    if (this.isRunning) {
      this.updateEvent.notify(this.now)
      this._now += 1
    }
    if (this.isDone) {
      this.onFinishTask()
    }
  }

  // 強制終了
  public terminate(): void {
    this.stop()
    this.onFinishTask()
  }

  private onFinishTask(): void {
    this.finishEvent.notify()
    TimerManager.deleteTimer(this)
  }

  // 毎フレーム呼ばれる関数を登録
  public onUpdate(callback: (time: number) => void): this {
    this.updateEvent.addObserver(callback)
    return this
  }

  // タイマー終了時に呼ばれる関数を登録
  public onFinish(callback: () => void): this {
    this.finishEvent.addObserver(callback)
    return this
  }

  public get end(): Promise<void> {
    return this._promise.promise
  }
}
