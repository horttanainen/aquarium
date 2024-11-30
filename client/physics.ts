import { Obj, objects } from "./objects"

let lastPhysInvokation = Date.now()

export function physics() {
  let time = Date.now()
  const deltaTime = time - lastPhysInvokation
  lastPhysInvokation = time
  for (let obj of objects) {
    if (!isMoving(obj) && obj.gravity === 0) {
      continue
    }

    obj.vel.y += obj.gravity * deltaTime / 1000

    obj.vel.y = Math.min(obj.vel.y, 200)

    obj.pos.x += obj.vel.x * deltaTime / 1000
    obj.pos.y += obj.vel.y * deltaTime / 1000
  }
}

export function isMoving(obj: Obj) {
  return obj.vel.x !== 0 || obj.vel.y !== 0
}
