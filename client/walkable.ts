import { config } from './config';
import { printFromCanvas } from './print';

const walkableCanvas = new OffscreenCanvas(config.width, config.height);
const walkableContext = walkableCanvas.getContext("2d");

if (!walkableContext) {
  throw new Error("Could not create walkable context!")
}

walkableContext.clearRect(0, 0, walkableContext.canvas.width, walkableContext.canvas.height);

export function getWalkableContext() {
  if (!walkableContext) {
    throw new Error("Walkable context was null")
  }
  return walkableContext
}

export function canWalk(x: number, y: number) {
  if (!walkableContext) {
    throw new Error("Walkable context was null")
  }
  const pixel = walkableContext.getImageData(x, y, 1, 1)
  return pixel.data[0] === 255
}

export function setWalkable(x: number, y: number, canWalk: boolean) {
  if (!walkableContext) {
    throw new Error("Walkable context was null")
  }

  if (canWalk) {
    walkableContext.fillStyle = 'rgb(255 0 0)'
  } else {
    walkableContext.fillStyle = 'rgb(0 0 0)'
  }
  walkableContext.fillRect(x, y, 1, 1)
}

export function setWalkableArea(x: number, y: number, w:number, h: number, canWalk: boolean) {
  if (!walkableContext) {
    throw new Error("Walkable context was null")
  }

  if (canWalk) {
    walkableContext.fillStyle = 'rgb(255 0 0)'
  } else {
    walkableContext.fillStyle = 'rgb(0 0 0)'
  }
  walkableContext.fillRect(x, y, w, h)
}
