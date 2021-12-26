import { buildColliders } from './collider/collider'
import { buildResourceURL } from './resourceURL'
import { updateStages } from './wall'
import { packTreeImage } from './tree'
;(async function main(): Promise<void> {
  const i = setInterval((): void => {})
  buildResourceURL()
  updateStages()
  await packTreeImage()
  await buildColliders()
  clearInterval(i)
})()
