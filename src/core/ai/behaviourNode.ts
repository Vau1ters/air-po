import { Entity } from '../ecs/entity'
import { World } from '../ecs/world'

export type ExecuteResult = 'Success' | 'Failure'

export type Behaviour = Generator<void, ExecuteResult>

export type BehaviourNode = (entity: Entity, world: World) => Behaviour

// export abstract class BehaviourNopo {
//   private _iterator: Behaviour
//   private _currentState: ExecuteState

//   public constructor() {
//     // 気持ち的にはthis.initialize()だが、TSが許してくれない
//     this._iterator = this._behaviour()
//     this._currentState = 'Pending'
//   }

//   public initialize(): void {
//     this._iterator = this._behaviour()
//     this._currentState = 'Pending'
//   }

//   protected abstract behaviour(): Behaviour

//   private *_behaviour(): Behaviour {
//     this._currentState = 'Running'
//     this._currentState = yield* this.behaviour()
//     return this._currentState
//   }

//   public execute(): ExecuteState {
//     this._iterator.next()
//     return this.currentState
//   }

//   public get iterator(): Behaviour {
//     return this._iterator
//   }

//   public get currentState(): ExecuteState {
//     return this._currentState
//   }

//   public get hasDone(): boolean {
//     return this.currentState === 'Failure' || this.currentState === 'Success'
//   }
// }
