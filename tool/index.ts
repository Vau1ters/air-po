import { buildColliders } from './collider/collider'
import { buildResourceURL } from './resourceURL'
import { updateStages } from './wall'
import { packWoodImage } from './wood'
;(async function main(): Promise<void> {
  const i = setInterval((): void => {})
  buildResourceURL()
  updateStages()
  await packWoodImage()
  await buildColliders()
  clearInterval(i)
})()
