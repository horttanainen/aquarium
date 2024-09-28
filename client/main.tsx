import { createRoot } from 'react-dom/client';
import { Canvas, DrawParams } from './Canvas';
import cloudImgSrc from './sprites/cloud.png'
import { Obj, objects, physics, addObject } from './physics';

function shouldRedraw(obj: Obj) {
  return Math.abs(obj.renderedPos.x - obj.pos.x) >= 1 ||
    Math.abs(obj.renderedPos.y - obj.pos.y) >= 1
}

function Aquarium() {

  const cloudImg = new Image()
  cloudImg.src = cloudImgSrc

  const cloud: Obj = {
    vel: {
      x: 2,
      y: 0
    },
    pos: {
      x: 0,
      y: 0
    },
    renderedPos: {
      x: 0,
      y: 0
    },
    sprite: cloudImg
  }

  const cloud2: Obj = {
    vel: {
      x: -2,
      y: 0
    },
    pos: {
      x: 200,
      y: 20
    },
    renderedPos: {
      x: 0,
      y: 0
    },
    sprite: cloudImg
  }

  const cloud3: Obj = {
    vel: {
      x: 5,
      y: 0
    },
    pos: {
      x: 0,
      y: 30
    },
    renderedPos: {
      x: 0,
      y: 0
    },
    sprite: cloudImg
  }
  const cloud4: Obj = {
    vel: {
      x: 1,
      y: 0
    },
    pos: {
      x: 100,
      y: 25
    },
    renderedPos: {
      x: 0,
      y: 0
    },
    sprite: cloudImg
  }

  const cloud5: Obj = {
    vel: {
      x: -6,
      y: 0
    },
    pos: {
      x: 300,
      y: 15
    },
    renderedPos: {
      x: 0,
      y: 0
    },
    sprite: cloudImg
  }

  addObject(cloud)
  addObject(cloud2)
  addObject(cloud3)
  addObject(cloud4)
  addObject(cloud5)

  setInterval(physics, 10)

  const drawForeground = ({ctx}: DrawParams) => {
    const alreadyDrawn: Obj[] = []
    for (let obj of objects) {
      if (alreadyDrawn.includes(obj) || !shouldRedraw(obj)) {
        continue
      }
      const intersectingObjects = objects
      intersectingObjects.sort()
      for (let objToClear of intersectingObjects) {
        ctx.clearRect(objToClear.renderedPos.x - 1, objToClear.renderedPos.y - 1, objToClear.sprite.width + 1, objToClear.sprite.height + 1)
      }
      for (let objToRedraw of intersectingObjects) {
        objToRedraw.renderedPos.x = Math.floor(objToRedraw.pos.x)
        objToRedraw.renderedPos.y = Math.floor(objToRedraw.pos.y)
        ctx.drawImage(objToRedraw.sprite, objToRedraw.renderedPos.x, objToRedraw.renderedPos.y)
        alreadyDrawn.push(objToRedraw)
      }
    }
  }
  const drawBackground = ({ctx}: DrawParams) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = 'lightblue'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  return (
    <>
      <Canvas draw={drawBackground}/>
      <Canvas draw={drawForeground}/>
    </>
  );
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error("Could not find #root")
}

const root = createRoot(rootElement);
root.render(<Aquarium />);
