import { collisions } from "./collider"
import { physics } from "./physics"

export let redraw = false
function mainLoop() {
  physics()
  collisions()
  redraw = true
}

export function resetRedraw() {
  redraw = false
}

export function startGame() {
  setInterval(mainLoop, 1000/60);
}
