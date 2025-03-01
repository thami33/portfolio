import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'

export function FloatingSphere() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sphereRef = useRef<THREE.Mesh>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const sceneRef = useRef<THREE.Scene>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()

  useEffect(() => {
    if (!containerRef.current) return

    // Setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(300, 300)
    rendererRef.current = renderer
    containerRef.current.appendChild(renderer.domElement)

    // Create sphere
    const geometry = new THREE.SphereGeometry(2, 64, 64)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x3b82f6) }, // blue-500
        color2: { value: new THREE.Color(0x06b6d4) }, // cyan-500
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          float noise = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time) * 0.5 + 0.5;
          vec3 color = mix(color1, color2, noise);
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(mix(color, vec3(1.0), fresnel * 0.7), 0.9);
        }
      `,
      transparent: true,
    })

    const sphere = new THREE.Mesh(geometry, material)
    sphereRef.current = sphere
    scene.add(sphere)

    // Animation
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (sphere && material.uniforms) {
        sphere.rotation.x += 0.001
        sphere.rotation.y += 0.002
        material.uniforms.time.value += 0.01
      }
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className="absolute -z-10 opacity-50"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.5 }}
      transition={{ duration: 1 }}
      style={{
        width: '300px',
        height: '300px',
        right: '5%',
        top: '20%',
      }}
    />
  )
} 