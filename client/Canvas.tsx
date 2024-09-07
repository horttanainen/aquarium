import { useEffect, useRef } from "react"

interface CanvasProps {
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void
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
      let frameCount = 0
      
      const render = () => {
        draw(context, frameCount++)
        animationFrameId = window.requestAnimationFrame(render)
      }
      render()
      
      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }
    }, [draw])
  
  return <canvas style={{width: '100%', position: 'absolute'}} ref={canvasRef} />
}

