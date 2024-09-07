import { createRoot } from 'react-dom/client';
import { Canvas } from './Canvas';

function Counter() {

  const drawForeground = (ctx: any, frameCount:number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.beginPath()
    ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx.fill()
  }
  const drawBackground = (ctx: any, _frameCount:number) => {
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
root.render(<Counter />);
