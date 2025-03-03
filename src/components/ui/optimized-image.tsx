'use client'

import { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string
  lowQualitySrc?: string
  className?: string
  containerClassName?: string
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/placeholder.jpg',
  lowQualitySrc,
  className,
  containerClassName,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority)
  const [imgSrc, setImgSrc] = useState(lowQualitySrc || src)
  const [isInView, setIsInView] = useState(false)

  // Handle image loading errors
  const handleError = () => {
    setImgSrc(fallbackSrc)
    setIsLoading(false)
  }

  // Handle successful image load
  const handleLoad = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    // Set up intersection observer to detect when image is in viewport
    if (!priority) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            setImgSrc(src)
            observer.disconnect()
          }
        },
        { rootMargin: '200px' } // Start loading when image is 200px from viewport
      )

      const element = document.getElementById(`image-${props.id || Math.random().toString(36).substring(7)}`)
      if (element) {
        observer.observe(element)
      }

      return () => {
        observer.disconnect()
      }
    } else {
      // If priority is true, load the image immediately
      setImgSrc(src)
      setIsInView(true)
    }
  }, [priority, props.id, src])

  return (
    <div 
      id={`image-${props.id || Math.random().toString(36).substring(7)}`}
      className={cn('relative overflow-hidden', containerClassName)}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse" />
      )}
      
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-40 blur-sm scale-105' : 'opacity-100 blur-0 scale-100',
          className
        )}
        onLoadingComplete={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  )
} 