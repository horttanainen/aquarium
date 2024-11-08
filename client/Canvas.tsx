import { useEffect, useRef } from "react"

export interface DrawParams {
  ctx: CanvasRenderingContext2D
  deltaTime: number
  time: number
}

interface CanvasProps {
  draw: (params: DrawParams) => boolean
  width: number
  height: number
}
export function Canvas({draw, height, width}: CanvasProps) {

    const canvasRef = useRef<HTMLCanvasElement|null>(null)
  
    useEffect(() => {
      const canvas: HTMLCanvasElement|null = canvasRef.current
      if (!canvas) {
        return
      }
      const context = canvas.getContext('2d')
      if (!context) {
        return
      }
      let animationFrameId: number
      
      let lastRender = Date.now()
      const render = () => {
        let time = Date.now()
        const deltaTime = time - lastRender 
        lastRender = time 
        const shouldRender = draw({ctx: context, deltaTime, time})
        if (shouldRender) {
          animationFrameId = window.requestAnimationFrame(render)
        }
      }
      render()
      
      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }
    }, [draw])
  
  return <canvas height={height} width={width} ref={canvasRef} />
}

