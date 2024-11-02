import { createRoot } from 'react-dom/client';
import { Canvas, DrawParams } from './Canvas';
import { physics } from './physics';
import { config } from './config';
import { useEffect, useRef } from 'react';
import { initializeClouds, initializeSun,  Obj, objects } from './objects';
import { getWalkableContext, setWalkableArea } from './walkable';

function shouldRedraw(obj: Obj) {
  return Math.abs(obj.renderedPos.x - obj.pos.x) >= 1 || Math.abs(obj.renderedPos.y - obj.pos.y) >= 1;
}

function sortByZ(a: Obj, b: Obj) {
  return a.z - b.z
}

function Aquarium() {
  initializeClouds()
  initializeSun()
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
    return true 
  };

  const drawTerrain = ({ctx}: DrawParams) => {
    ctx.fillStyle = 'green'
    ctx.fillRect(0, ctx.canvas.height/2, ctx.canvas.width, 200)
    setWalkableArea(0, ctx.canvas.height/2, ctx.canvas.width, 200, true)

    return false
  };

  const drawSkyBackground = ({ctx}: DrawParams) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return false
  };

  const drawGroundBackground = ({ctx}: DrawParams) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'saddlebrown';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return false
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
      <div style={{position: 'absolute'}}>
        <Canvas draw={drawTerrain} height={config.height} width={config.width}/>
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

