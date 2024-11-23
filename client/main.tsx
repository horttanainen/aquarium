import { createRoot } from 'react-dom/client';
import { Canvas, DrawParams } from './Canvas';
import { physics } from './physics';
import { config } from './config';
import { useEffect, useRef, useState } from 'react';
import { initializeClouds, initializeSun,  Obj, objects } from './objects';
import { printCollider, setCollider } from './collider';
import { getWangContext, initializeTerrain, loadTiles } from './terrain';

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

  const [tilesLoaded, setLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      await loadTiles()
      initializeTerrain()
    }
    load().then(() => setLoaded(true))
  }, [])

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
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const wangContext = getWangContext()
    const subsetX = Math.floor(Math.random() * (wangContext.canvas.width - config.wangSquarePx * 2))
    const subsetY = Math.floor(Math.random() * (wangContext.canvas.height - config.wangSquarePx * 2))

    const wangSubset = wangContext.getImageData(subsetX, subsetY, config.wangSquarePx * 4, config.wangSquarePx * 4)

    const dataByPixels = wangSubset.data.reduce((acc: number[][], cur) => {
      const row = acc[acc.length - 1]
      row.push(cur)
      if (row.length === 4) {
        acc.push([])
      }
      return acc
      }, [[]])
    const dataByRows = dataByPixels.reduce((acc: number[][][], cur) => {
      const row = acc[acc.length - 1]
      row.push(cur)
      if (row.length % (config.wangSquarePx * 4) === 0) {
        acc.push([])
      }
      return acc
      }, [[]])

    let tmpX = 0
    let tmpY = 0
    dataByRows.forEach(row => {
      tmpX = 0
      row.forEach(pixel => {
        if (pixel[0] === 255 && pixel[1] === 255 && pixel[2] == 255) {
          ctx.fillStyle = `chocolate`
          ctx.fillRect(tmpX, Math.floor(config.height/2) + tmpY, config.gridResolution, config.gridResolution)
          setCollider(tmpX, Math.floor(config.height/2) + tmpY, config.gridResolution, config.gridResolution, true)
        }
        tmpX += config.gridResolution
      })
      tmpY += config.gridResolution
    })

    printCollider()
    return !tilesLoaded
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

