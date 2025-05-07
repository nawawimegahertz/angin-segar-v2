"use client"

import { useEffect, useRef } from "react"

interface WindIndicatorProps {
  windSpeed: string
  size?: number
}

export function WindIndicator({ windSpeed, size = 120 }: WindIndicatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const speed = Number.parseFloat(windSpeed) || 0
  const rotationSpeed = Math.max(0.5, 10 - speed / 3)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let rotation = 0

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set center point
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) * 0.8

      // Draw the anemometer base
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.15, 0, Math.PI * 2)
      ctx.fillStyle = "#047857"
      ctx.fill()

      // Draw the anemometer cups
      const cupRadius = radius * 0.25
      const cupDistance = radius * 0.7

      for (let i = 0; i < 3; i++) {
        const angle = rotation + (i * Math.PI * 2) / 3
        const x = centerX + Math.cos(angle) * cupDistance
        const y = centerY + Math.sin(angle) * cupDistance

        // Draw cup
        ctx.beginPath()
        ctx.arc(x, y, cupRadius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(4, 120, 87, 0.8)"
        ctx.fill()
        ctx.strokeStyle = "#065f46"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw cup stem
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.strokeStyle = "#065f46"
        ctx.lineWidth = 3
        ctx.stroke()
      }

      // Update rotation
      rotation += 0.02 / rotationSpeed

      // Continue animation
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [rotationSpeed])

  return (
    <div className="relative flex items-center justify-center">
      <canvas ref={canvasRef} width={size} height={size} className="rounded-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold text-emerald-900 dark:text-emerald-100 z-10">{windSpeed}</span>
      </div>
    </div>
  )
}
