// import { Behaviour } from '../behaviourNode'
// import { CompositeNode } from './compositeNode'

// export class SequenceNode extends CompositeNode {
//   protected *behaviour(): Behaviour {
//     for (const node of this.children) {
//       const result = yield* node.iterator
//       if (result === 'Failure') {
//         return 'Failure'
//       }
//     }
//     return 'Success'
//   }
// }
