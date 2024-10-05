import { createRoot } from 'react-dom/client';
import { Canvas, DrawParams } from './Canvas';
import cloudImgSrc from './sprites/cloud.png'
import { Obj, objects, physics, addObject } from './physics';
import { config } from './config';
import { useEffect, useRef } from 'react';

function shouldRedraw(obj: Obj) {
  return Math.abs(obj.renderedPos.x - obj.pos.x) >= 1 || Math.abs(obj.renderedPos.y - obj.pos.y) >= 1;
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
    sprite: image
  };
}

function initializeClouds() {
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

function sortByZ(a: Obj, b: Obj) {
  return a.z - b.z
}

function Aquarium() {
  initializeClouds()
  setInterval(physics, 10);

  const drawForeground = ({ctx}: DrawParams) => {
    const alreadyDrawn: Obj[] = [];
    for (let obj of objects) {
      if (alreadyDrawn.includes(obj) || !shouldRedraw(obj)) {
        continue;
      }
      const intersectingObjects = [...objects].sort(sortByZ);
      for (let objToClear of intersectingObjects) {
        ctx.clearRect(objToClear.renderedPos.x - 1, objToClear.renderedPos.y - 1, objToClear.scale.x * objToClear.sprite.width + 1, objToClear.scale.y * objToClear.sprite.height + 1);
      }
      for (let objToRedraw of intersectingObjects) {
        objToRedraw.renderedPos.x = Math.floor(objToRedraw.pos.x);
        objToRedraw.renderedPos.y = Math.floor(objToRedraw.pos.y);
        ctx.drawImage(objToRedraw.sprite, objToRedraw.renderedPos.x, objToRedraw.renderedPos.y, objToRedraw.scale.x * objToRedraw.sprite.width, objToRedraw.scale.y * objToRedraw.sprite.height);
        alreadyDrawn.push(objToRedraw);
      }
    }
  };

  const drawSkyBackground = ({ctx}: DrawParams) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const drawGroundBackground = ({ctx}: DrawParams) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'saddlebrown';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const initialWindowPosition = useRef<HTMLDivElement|null>(null)

  useEffect(() => {
    if (!initialWindowPosition.current) {
      return
    }
    initialWindowPosition.current.scrollIntoView({behavior: 'smooth'})
  }, [])

  return (
    <>
      <div style={{position: 'absolute'}}>
        <Canvas draw={drawForeground} height={config.height} width={config.width}/>
      </div>
      <div>
          <Canvas draw={drawSkyBackground} height={config.height / 2} width={config.width}/>
          <div style={{position: 'relative', top: -config.height/3 + 'px'}} ref={initialWindowPosition}/>
          <Canvas draw={drawGroundBackground} height={config.height / 2} width={config.width}/>
      </div>
    </>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find #root");
}

const root = createRoot(rootElement);
root.render(<Aquarium />);

