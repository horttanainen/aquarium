import { config } from './config';
import { printFromCanvas } from './print';

const walkableCanvas = new OffscreenCanvas(Math.floor(config.width/config.gridResolution), Math.floor(config.height/config.gridResolution));
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
  const pixel = walkableContext.getImageData(Math.floor(x/config.gridResolution), Math.floor(y/config.gridResolution), 1, 1)
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
  walkableContext.fillRect(Math.floor(x/config.gridResolution), Math.floor(y/config.gridResolution), 1, 1)
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
  walkableContext.fillRect(Math.floor(x/config.gridResolution), Math.floor(y/config.gridResolution), Math.floor(w/config.gridResolution), Math.floor(h/config.gridResolution))
  printFromCanvas(walkableCanvas)
}
