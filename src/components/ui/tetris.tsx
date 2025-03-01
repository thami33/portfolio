'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const BLOCK_SIZE = 25

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]], // J
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
]

const COLORS = [
  'from-neutral-500 to-neutral-600',
  'from-neutral-600 to-neutral-700',
  'from-neutral-700 to-neutral-800',
  'from-neutral-800 to-neutral-900',
]

export function Tetris() {
  const [board, setBoard] = useState<number[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
  )
  const [currentPiece, setCurrentPiece] = useState({
    shape: SHAPES[0],
    x: 3,
    y: 0,
  })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const createNewPiece = useCallback(() => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length)
    const shape = SHAPES[shapeIndex]
    setCurrentPiece({
      shape,
      x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
      y: 0,
    })
  }, [])

  const checkCollision = useCallback((shape: number[][], x: number, y: number) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col
          const newY = y + row
          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY][newX])
          ) {
            return true
          }
        }
      }
    }
    return false
  }, [board])

  const mergePiece = useCallback(() => {
    const newBoard = board.map(row => [...row])
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          const newY = currentPiece.y + row
          if (newY < 0) {
            setGameOver(true)
            return
          }
          newBoard[newY][currentPiece.x + col] = 1
        }
      }
    }
    setBoard(newBoard)
    createNewPiece()
  }, [board, currentPiece, createNewPiece])

  const moveDown = useCallback(() => {
    if (!checkCollision(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
      setCurrentPiece(prev => ({ ...prev, y: prev.y + 1 }))
    } else {
      mergePiece()
    }
  }, [currentPiece, checkCollision, mergePiece])

  const moveLeft = useCallback(() => {
    if (!checkCollision(currentPiece.shape, currentPiece.x - 1, currentPiece.y)) {
      setCurrentPiece(prev => ({ ...prev, x: prev.x - 1 }))
    }
  }, [currentPiece, checkCollision])

  const moveRight = useCallback(() => {
    if (!checkCollision(currentPiece.shape, currentPiece.x + 1, currentPiece.y)) {
      setCurrentPiece(prev => ({ ...prev, x: prev.x + 1 }))
    }
  }, [currentPiece, checkCollision])

  const rotate = useCallback(() => {
    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[row.length - 1 - i])
    )
    if (!checkCollision(rotated, currentPiece.x, currentPiece.y)) {
      setCurrentPiece(prev => ({ ...prev, shape: rotated }))
    }
  }, [currentPiece, checkCollision])

  useEffect(() => {
    if (gameOver || isPaused) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          moveLeft()
          break
        case 'ArrowRight':
          moveRight()
          break
        case 'ArrowDown':
          moveDown()
          break
        case 'ArrowUp':
          rotate()
          break
        case ' ':
          setIsPaused(prev => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameOver, isPaused, moveDown, moveLeft, moveRight, rotate])

  useEffect(() => {
    if (gameOver || isPaused) return

    const interval = setInterval(moveDown, 1000)
    return () => clearInterval(interval)
  }, [gameOver, isPaused, moveDown])

  const getBlockColor = (x: number, y: number) => {
    // Use position to determine color index deterministically
    return COLORS[(x + y) % COLORS.length]
  }

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])
    
    // Add current piece to display board
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          const y = currentPiece.y + row
          const x = currentPiece.x + col
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            displayBoard[y][x] = 2
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <motion.div
            key={`${x}-${y}`}
            className={`
              w-[${BLOCK_SIZE}px] h-[${BLOCK_SIZE}px] m-[1px] rounded-sm
              ${cell ? 'bg-gradient-to-br ' + getBlockColor(x, y) : 'bg-neutral-900/50'}
              backdrop-blur-sm ring-1 ring-neutral-800/50
            `}
            initial={{ scale: cell ? 0 : 1 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        ))}
      </div>
    ))
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 rounded-xl blur-lg" />
        <div className="relative bg-black/40 p-4 rounded-lg ring-1 ring-neutral-800 backdrop-blur-sm">
          {renderBoard()}
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => {
            setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)))
            setScore(0)
            setGameOver(false)
            createNewPiece()
          }}
          className="px-4 py-2 rounded-lg bg-neutral-900/50 text-neutral-300 hover:text-white ring-1 ring-neutral-800 hover:ring-neutral-700 transition-all duration-300"
        >
          New Game
        </button>
        <button
          onClick={() => setIsPaused(prev => !prev)}
          className="px-4 py-2 rounded-lg bg-neutral-900/50 text-neutral-300 hover:text-white ring-1 ring-neutral-800 hover:ring-neutral-700 transition-all duration-300"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
      
      {(gameOver || isPaused) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-2xl font-medium text-white">
            {gameOver ? 'Game Over' : 'Paused'}
          </div>
        </div>
      )}
    </div>
  )
} 