import { config } from './config';
import { Obj, objects } from './objects';
import { printFromCanvas } from './print';

const colliderCanvas = new OffscreenCanvas(config.width, config.height);
const colliderContext = colliderCanvas.getContext("2d");

export function clearCollider() {
  if (!colliderContext) {
    throw new Error("Could not create collider context!")
  }

  colliderContext.clearRect(0, 0, colliderContext.canvas.width, colliderContext.canvas.height);
}

export function getColliderContext() {
  if (!colliderContext) {
    throw new Error("Collider context was null")
  }
  return colliderContext
}

export function collides(x: number, y: number) {
  if (!colliderContext) {
    throw new Error("Collider context was null")
  }
  const pixel = colliderContext.getImageData(x, y, 1, 1)
  return pixel.data[0] === 255
}

export function setCollider(x: number, y: number, w:number, h: number, collides: boolean) {
  if (!colliderContext) {
    throw new Error("Collider context was null")
  }

  if (collides) {
    colliderContext.fillStyle = 'rgb(255 0 0)'
  } else {
    colliderContext.fillStyle = 'rgb(0 0 0)'
  }
  colliderContext.fillRect(x, y, w, h)
}

export function printCollider() {
  printFromCanvas(colliderCanvas)
}

let lastCollisionInvokation = Date.now()
export function collisions() {
  let time = Date.now()
  const deltaTime = time - lastCollisionInvokation
  lastCollisionInvokation = time
  for (let obj of objects) {
    if (isInsideCollider(obj)) {
      obj.gravity = 0
      obj.vel.y = 0
      obj.vel.y -= 10 * 1.5 * deltaTime / 1000
    }
  }
}

export function isInsideCollider(obj: Obj) {
  return collides(obj.pos.x, obj.pos.y)
}
