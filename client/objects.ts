import cloudImgSrc from './sprites/cloud.png'
import sunImgSrc from './sprites/sun.png'
import { config } from './config';

export interface Obj {
  name: string
  vel:  {
    x: number,
    y: number
  },
  renderedPos: {
    x: number,
    y: number
  },
  pos: {
    x: number,
    y: number
  },
  scale: {
    x: number,
    y: number
  },
  z: number
  sprite: HTMLImageElement
}

export const objects: Obj[] = []

export function addObject(obj: Obj) {
  objects.push(obj)
}

function createCloud(imgSrc: string, {velX, posX, posY, scale, z}: {velX: number, velY: number, posX: number, posY: number, scale: number, z: number}): Obj {
  const image = new Image();
  image.src = imgSrc;

  return {
    vel: { x: velX, y: 0 },
    pos: { x: posX, y: posY },
    scale: {x: scale, y: scale},
    renderedPos: { x: 0, y: 0 },
    z,
    sprite: image,
    name: "cloud",
  };
}

export function initializeClouds() {
  const cloudImg = cloudImgSrc;

  const cloudConfigs = [...Array(100).keys()].map(_ind => {
    const posX = Math.random() * config.width
    const posY = Math.random() * config.height / 3
    const velX = Math.random() * 20 - 10
    const scale = Math.random() * 3 + 1

      return {velX, velY: 0, posX, posY, scale, z: scale}
    })

  cloudConfigs.forEach(config => addObject(createCloud(cloudImg, config)));
}


export function initializeSun() {
  const image = new Image();
  image.src = sunImgSrc;

  const sunObj = {
    vel: { x: 1, y: -1 },
    pos: { x: 0, y: config.height / 2.5 },
    scale: {x: 2, y: 2},
    renderedPos: { x: 0, y: 0 },
    z: -1,
    sprite: image,
    name: "sun"
  };
  addObject(sunObj)
}
