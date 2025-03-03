import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { throttle } from 'lodash'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const mousePos = useRef({ x: 0, y: 0 })
  const animationFrameId = useRef<number>()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Observer to disable animations when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    
    observer.observe(canvas)

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles.current = []
      // Reduce particle count for better performance
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 25000)
      
      for (let i = 0; i < numParticles; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3, // Reduced velocity
          vy: (Math.random() - 0.5) * 0.3, // Reduced velocity
          size: Math.random() * 1.5 + 0.5, // Smaller particles
          color: `rgba(59, 130, 246, ${Math.random() * 0.4 + 0.1})`, // Lower opacity
        })
      }
    }

    const drawParticles = () => {
      if (!isVisible) {
        animationFrameId.current = requestAnimationFrame(drawParticles)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Pre-calculate mouse interaction values
      const mouseX = mousePos.current.x
      const mouseY = mousePos.current.y
      const interactionRadius = 80 // Reduced from 100

      particles.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Only check connections with nearby particles to improve performance
        // Check every other particle to reduce calculations
        for (let j = i + 1; j < particles.current.length; j += 2) {
          const otherParticle = particles.current[j]
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = dx * dx + dy * dy // Avoid square root for performance

          if (distance < 10000) { // 100^2
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.05 * (1 - distance / 10000)})`
            ctx.stroke()
          }
        }

        // Mouse interaction
        const dx = particle.x - mouseX
        const dy = particle.y - mouseY
        const distance = dx * dx + dy * dy // Avoid square root for performance

        if (distance < interactionRadius * interactionRadius) {
          const angle = Math.atan2(dy, dx)
          const force = (interactionRadius - Math.sqrt(distance)) * 0.00005
          particle.vx += Math.cos(angle) * force
          particle.vy += Math.sin(angle) * force
        }

        // Apply drag
        particle.vx *= 0.98
        particle.vy *= 0.98
      })

      animationFrameId.current = requestAnimationFrame(drawParticles)
    }

    // Throttle mouse move handler to improve performance
    const handleMouseMove = throttle((e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }, 16) // ~60fps

    const handleResize = throttle(() => {
      resizeCanvas()
      createParticles()
    }, 200)

    // Initialize
    resizeCanvas()
    createParticles()
    animationFrameId.current = requestAnimationFrame(drawParticles)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [isVisible])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
} 