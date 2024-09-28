import { useEffect, useRef } from "react"

export interface DrawParams {
  ctx: CanvasRenderingContext2D
  deltaTime: number
  time: number
}

interface CanvasProps {
  draw: (params: DrawParams) => void
}
export function Canvas({draw}: CanvasProps) {

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
        draw({ctx: context, deltaTime, time})
        animationFrameId = window.requestAnimationFrame(render)
      }
      render()
      
      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }
    }, [draw])
  
  return <canvas style={{width: '100%', position: 'absolute'}} ref={canvasRef} />
}

