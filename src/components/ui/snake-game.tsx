import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon, BoltIcon, SparklesIcon } from '@heroicons/react/24/solid';

const GRID_SIZE = 20;
const CELL_SIZE = 25;
const INITIAL_SPEED = 200;
const SPEED_INCREMENT = 1;
const NORMAL_FOOD_BEFORE_FUN_FACT = 3; // Number of normal food items to eat before fun fact appears
const POWER_UP_CHANCE = 0.15; // 15% chance for power-ups

const funFacts = [
  "I studied construction engineering before transitioning to tech. Now, I engineer digital experiences instead of machines!😌",
  "Based in Johannesburg, working worldwide🌍",
  "I'm passionate about teaching others about ai🫂🫂",
  "When I'm not coding, you'll find me in the ai worlds strategizing or exploring new virtual realms.",
  "With a background in graphic design and multimedia, I blend creativity with code🎨",
  "Code runs on caffeine… and McDonald. The ultimate fuel for any late-night project.",
  "My best ideas tend to hit before sunrise—call it my productivity sweet spot. ",
  "I spend more time talking to AI than to humans… and AI actually listens!🙈",
  "Big ideas don/'t scare me — I build them 🚧",
  "I can debug code while playing Snake! 🐍"
];

type Position = {
  x: number;
  y: number;
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

type FoodType = 'regular' | 'funFact';

interface Food extends Position {
  type: FoodType;
}

// Different types of power-ups
type PowerUpType = 'speedBoost' | 'shield';  // Removed pointsMultiplier

interface PowerUp extends Position {
  type: PowerUpType;
  duration: number; // Duration in seconds
}

// Power-up notification state
type PowerUpNotification = {
  type: PowerUpType;
  message: string;
  visible: boolean;
};

// Game levels configuration
const LEVELS = [
  { required: 0, name: "Beginner", color: "from-green-500 to-emerald-500" },
  { required: 100, name: "Intermediate", color: "from-blue-500 to-indigo-500" },
  { required: 250, name: "Advanced", color: "from-purple-500 to-violet-500" },
  { required: 500, name: "Expert", color: "from-rose-500 to-pink-500" },
  { required: 1000, name: "Master", color: "from-yellow-500 to-amber-500" },
];

// Power-up messages
const POWER_UP_MESSAGES = {
  speedBoost: "Speed Boost activated!",
  shield: "Shield activated!"
};

// Hook to detect if device is mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

export function SnakeGame() {
  const isMobile = useIsMobile();
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Food>({ x: 15, y: 15, type: 'regular' });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const lastValidDirectionRef = useRef<Direction>('RIGHT');
  const directionQueueRef = useRef<Direction[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPaused, setIsPaused] = useState(true); // Start paused
  const [currentFact, setCurrentFact] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false); // New state for tracking if game has started
  const gameLoopRef = useRef<number>();
  const [powerUp, setPowerUp] = useState<PowerUp | null>(null);
  const [activeEffects, setActiveEffects] = useState<{
    speedBoost: boolean;
    shield: boolean;
  }>({
    speedBoost: false,
    shield: false,
  });
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('snakeHighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [currentLevel, setCurrentLevel] = useState(0);
  const [normalFoodEaten, setNormalFoodEaten] = useState(0); // Counter for normal food eaten
  const [currentFactIndex, setCurrentFactIndex] = useState(0); // Index to track which fun fact to show next
  const [powerUpNotification, setPowerUpNotification] = useState<PowerUpNotification | null>(null);

  // Modified direction change validation
  const isValidDirectionChange = (current: Direction, next: Direction): boolean => {
    const opposites = {
      'UP': 'DOWN',
      'DOWN': 'UP',
      'LEFT': 'RIGHT',
      'RIGHT': 'LEFT'
    };
    return opposites[current] !== next;
  };

  // Generate random food position with type based on normalFoodEaten counter
  const generateFood = (): Food => {
    // Determine food type based on normalFoodEaten counter
    const shouldGenerateFunFact = normalFoodEaten >= NORMAL_FOOD_BEFORE_FUN_FACT;
    
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      type: shouldGenerateFunFact ? 'funFact' : 'regular' as FoodType
    };
    
    // Make sure food doesn't spawn on snake
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    
    // Reset counter if fun fact food was generated
    if (newFood.type === 'funFact') {
      setNormalFoodEaten(0);
    }
    
    return newFood;
  };

  // Show fun fact with countdown - now using sequential order
  const showFunFact = () => {
    // Get the current fun fact and increment the index for next time
    const fact = funFacts[currentFactIndex];
    setCurrentFact(fact);
    setIsPaused(true);
    
    // Update the index for the next fun fact, cycling back to the beginning if needed
    setCurrentFactIndex(prevIndex => (prevIndex + 1) % funFacts.length);
    
    // Start countdown after 4 seconds of showing the fact
    setTimeout(() => {
      setCountdown(3);
      
      // Countdown from 3 to 1
      const countInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countInterval);
            setCurrentFact(null);
            setIsPaused(false);
            setCountdown(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }, 4000);
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys and space
      if (e.key === ' ' || 
          e.key === 'ArrowUp' || 
          e.key === 'ArrowDown' || 
          e.key === 'ArrowLeft' || 
          e.key === 'ArrowRight') {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }

      if (isPaused) return;

      let newDirection: Direction | null = null;
      switch (e.key) {
        case 'ArrowUp': newDirection = 'UP'; break;
        case 'ArrowDown': newDirection = 'DOWN'; break;
        case 'ArrowLeft': newDirection = 'LEFT'; break;
        case 'ArrowRight': newDirection = 'RIGHT'; break;
      }

      if (newDirection && isValidDirectionChange(lastValidDirectionRef.current, newDirection)) {
        directionQueueRef.current.push(newDirection);
        if (directionQueueRef.current.length > 2) {
          directionQueueRef.current = directionQueueRef.current.slice(-2);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPaused]);

  // Generate power-up
  const generatePowerUp = (): PowerUp | null => {
    if (Math.random() < POWER_UP_CHANCE) {
      const types: PowerUpType[] = ['speedBoost', 'shield'];  // Removed pointsMultiplier
      const type = types[Math.floor(Math.random() * types.length)];
      const position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        type,
        duration: 10,
      };
      
      if (snake.some(segment => segment.x === position.x && segment.y === position.y) ||
          (food.x === position.x && food.y === position.y)) {
        return generatePowerUp();
      }
      
      return position;
    }
    return null;
  };

  // Apply power-up effect
  const applyPowerUp = (type: PowerUpType) => {
    setActiveEffects(prev => ({ ...prev, [type]: true }));
    
    // Power-up specific effects
    switch (type) {
      case 'speedBoost':
        setSpeed(prev => prev * 0.7); // 30% faster
        break;
      case 'shield':
        // Shield is handled in collision detection
        break;
    }

    // Remove effect after duration
    setTimeout(() => {
      setActiveEffects(prev => ({ ...prev, [type]: false }));
      if (type === 'speedBoost') {
        setSpeed(INITIAL_SPEED - (currentLevel * SPEED_INCREMENT));
      }
    }, powerUp?.duration! * 1000);
  };

  // Update level based on score
  useEffect(() => {
    const newLevel = LEVELS.findIndex((level, index) => {
      const nextLevel = LEVELS[index + 1];
      return !nextLevel || score < nextLevel.required;
    });
    
    if (newLevel !== currentLevel) {
      setCurrentLevel(newLevel);
    }
  }, [score]);

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      if (typeof window !== 'undefined') {
        localStorage.setItem('snakeHighScore', score.toString());
      }
    }
  }, [score]);

  // Modified game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        // Process direction queue
        if (directionQueueRef.current.length > 0) {
          const nextDirection = directionQueueRef.current[0];
          if (isValidDirectionChange(lastValidDirectionRef.current, nextDirection)) {
            setDirection(nextDirection);
            lastValidDirectionRef.current = nextDirection;
            directionQueueRef.current.shift();
          }
        }

        // Move head
        switch (direction) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Check collision with walls
        if (!activeEffects.shield && (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE)) {
          setGameOver(true);
          return prevSnake;
        }

        // Wrap around if shielded
        if (activeEffects.shield) {
          if (head.x < 0) head.x = GRID_SIZE - 1;
          if (head.x >= GRID_SIZE) head.x = 0;
          if (head.y < 0) head.y = GRID_SIZE - 1;
          if (head.y >= GRID_SIZE) head.y = 0;
        }

        // Check collision with self (excluding the tail if not growing)
        const snakeBody = newSnake.slice(0, -1);
        if (!activeEffects.shield && snakeBody.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        // Check if food is eaten
        if (head.x === food.x && head.y === food.y) {
          // Simple scoring without combo
          const points = food.type === 'funFact' ? 25 : 10;
          setScore(prev => prev + points);
          
          if (food.type === 'funFact') {
            showFunFact();
          } else {
            // Increment normal food counter only if regular food was eaten
            setNormalFoodEaten(prev => prev + 1);
          }
          
          setFood(generateFood());
          setPowerUp(generatePowerUp());
        } else {
          newSnake.pop();
        }

        // Check if power-up is collected
        if (powerUp && head.x === powerUp.x && head.y === powerUp.y) {
          applyPowerUp(powerUp.type);
          setPowerUp(null);
        }

        newSnake.unshift(head);
        return newSnake;
      });
    };

    gameLoopRef.current = window.setInterval(moveSnake, speed);
    return () => clearInterval(gameLoopRef.current);
  }, [direction, food, gameOver, isPaused, speed, powerUp, activeEffects, normalFoodEaten]);

  // Modified mobile control handler
  const handleMobileControl = (newDirection: Direction) => {
    if (!isPaused && gameStarted && !gameOver) {
      if (isValidDirectionChange(lastValidDirectionRef.current, newDirection)) {
        directionQueueRef.current.push(newDirection);
        if (directionQueueRef.current.length > 2) {
          directionQueueRef.current = directionQueueRef.current.slice(-2);
        }
      }
    }
  };

  // Modified reset game function
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    lastValidDirectionRef.current = 'RIGHT';
    directionQueueRef.current = [];
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(true);
    setGameStarted(false);
    setNormalFoodEaten(0); // Reset normal food counter
    // Don't reset currentFactIndex to maintain sequential order across games
  };

  // Modified start game function
  const startGame = () => {
    setGameStarted(true);
    setIsPaused(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    lastValidDirectionRef.current = 'RIGHT';
    directionQueueRef.current = [];
    setFood(generateFood());
    setNormalFoodEaten(0); // Reset normal food counter
  };

  // Render power-up with updated colors
  const renderPowerUp = () => {
    if (!powerUp) return null;

    const powerUpColors = {
      speedBoost: "from-blue-500 to-cyan-500",
      shield: "from-purple-500 to-violet-500"
    };

    const powerUpShapes = {
      speedBoost: "rounded-full",
      shield: "rounded-lg"
    };

    return (
      <motion.div
        className={`absolute ${powerUpShapes[powerUp.type]} bg-gradient-to-r ${powerUpColors[powerUp.type]} ring-2 ring-white/50`}
        style={{
          width: CELL_SIZE - 2,
          height: CELL_SIZE - 2,
          left: powerUp.x * CELL_SIZE + 16,
          top: powerUp.y * CELL_SIZE + 16,
        }}
        initial={{ scale: 0.8 }}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    );
  };

  return (
    <div className="relative">
      {/* Score Display Above Game Board */}
      {gameStarted && (
        <div className="flex items-center justify-between mb-4">
          {/* Level Display */}
          <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${LEVELS[currentLevel].color} text-white font-medium backdrop-blur-sm`}>
            Level: {LEVELS[currentLevel].name}
          </div>
          
          {/* Score and Best Score */}
          <div className="flex gap-4">
            <div className="px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm text-white font-medium ring-1 ring-white/10">
              Score: {score}
            </div>
            <div className="px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm text-white font-medium ring-1 ring-white/10">
              Best: {highScore}
            </div>
          </div>
        </div>
      )}

      {/* Game board */}
      <div 
        className="relative bg-black/50 backdrop-blur-sm rounded-lg p-4 ring-1 ring-white/10"
        style={{ 
          width: GRID_SIZE * CELL_SIZE + 32,
          height: GRID_SIZE * CELL_SIZE + 32,
        }}
      >
        {/* Clear Walls */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          {/* Top Wall */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-indigo-500/20 to-transparent backdrop-blur-sm" />
          {/* Bottom Wall */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-indigo-500/20 to-transparent backdrop-blur-sm" />
          {/* Left Wall */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-indigo-500/20 to-transparent backdrop-blur-sm" />
          {/* Right Wall */}
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-indigo-500/20 to-transparent backdrop-blur-sm" />
          
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 rounded-tl-lg bg-gradient-to-br from-indigo-500/30 to-transparent backdrop-blur-sm" />
          <div className="absolute top-0 right-0 w-8 h-8 rounded-tr-lg bg-gradient-to-bl from-indigo-500/30 to-transparent backdrop-blur-sm" />
          <div className="absolute bottom-0 left-0 w-8 h-8 rounded-bl-lg bg-gradient-to-tr from-indigo-500/30 to-transparent backdrop-blur-sm" />
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-br-lg bg-gradient-to-tl from-indigo-500/30 to-transparent backdrop-blur-sm" />
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-4 grid grid-cols-20 grid-rows-20">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div
              key={i}
              className="border border-indigo-500/5"
            />
          ))}
        </div>

        {/* Snake and Food only render when game has started */}
        {gameStarted && (
          <>
            {/* Snake */}
            {snake.map((segment, index) => (
              <motion.div
                key={index}
                className={`absolute rounded-lg ${
                  activeEffects.shield 
                    ? 'bg-gradient-to-r from-purple-500 to-violet-500 shadow-xl shadow-purple-500/70 ring-2 ring-purple-300/70 z-10' 
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-500'
                }`}
                style={{
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                  left: segment.x * CELL_SIZE + 16,
                  top: segment.y * CELL_SIZE + 16,
                }}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: activeEffects.shield ? [1, 1.05, 1] : 1,
                  rotate: activeEffects.shield && index === 0 ? [0, 5, 0, -5, 0] : 0
                }}
                transition={{ 
                  duration: activeEffects.shield ? 1 : 0.1,
                  repeat: activeEffects.shield ? Infinity : 0,
                  repeatType: "reverse"
                }}
              />
            ))}

            {/* Food */}
            <motion.div
              className={`absolute rounded-full ${
                food.type === 'funFact' 
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 ring-2 ring-yellow-300/50' 
                  : 'bg-gradient-to-r from-rose-500 to-pink-500'
              }`}
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                left: food.x * CELL_SIZE + 16,
                top: food.y * CELL_SIZE + 16,
              }}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: food.type === 'funFact' ? [1, 1.2, 1] : [1, 1.1, 1],
                rotate: food.type === 'funFact' ? [0, 180, 360] : 0
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </>
        )}

        {/* Start Screen */}
        {!gameStarted && !gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center rounded-lg"
          >
            <div className="text-center px-8 py-6 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl ring-1 ring-indigo-500/20">
              <h3 className="text-2xl font-bold text-indigo-400 mb-4">Welcome to Snake!</h3>
              <p className="text-white text-lg mb-6">Collect the glowing orbs to learn fun facts about me!</p>
              <div className="space-y-2 mb-6 text-gray-300 text-sm">
                {isMobile ? (
                  <p>Use the on-screen controls to play!</p>
                ) : (
                  <>
                    <p>⬆️ Up Arrow - Move Up</p>
                    <p>⬇️ Down Arrow - Move Down</p>
                    <p>⬅️ Left Arrow - Move Left</p>
                    <p>➡️ Right Arrow - Move Right</p>
                    <p>Space - Pause Game</p>
                  </>
                )}
              </div>
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
              >
                Start Game
              </button>
            </div>
          </motion.div>
        )}

        {/* Fun Fact Overlay */}
        <AnimatePresence>
          {(currentFact || countdown) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center rounded-lg"
            >
              <div className="text-center px-8 py-6 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl ring-1 ring-yellow-500/20">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">Fun Fact About Me!</h3>
                <p className="text-white text-xl leading-relaxed">{currentFact}</p>
                {countdown && (
                  <motion.p
                    key="countdown"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="text-yellow-400 text-xl font-bold mt-4"
                  >
                    Game resuming in {countdown}...
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Game Over!</h3>
              <p className="text-gray-300 mb-4">Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Pause Overlay - Only show when game has started, is paused, and no fun fact */}
        {gameStarted && isPaused && !gameOver && !currentFact && !countdown && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Paused</h3>
              <p className="text-gray-300">Press Space to Resume</p>
            </div>
          </div>
        )}

        {/* Power-up */}
        {gameStarted && renderPowerUp()}

        {/* Active Effects Indicators - Enhanced */}
        {gameStarted && (
          <div className="absolute top-2 left-2 flex gap-2">
            {Object.entries(activeEffects).map(([effect, active]) => {
              if (!active) return null;
              
              const effectColors = {
                speedBoost: "bg-blue-500/80",
                shield: "bg-purple-500/80"
              };
              
              return (
                <motion.div
                  key={effect}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    y: effect === 'shield' ? [0, -3, 0] : 0
                  }}
                  exit={{ scale: 0 }}
                  transition={{ 
                    duration: 0.3,
                    y: {
                      duration: 1,
                      repeat: effect === 'shield' ? Infinity : 0,
                      repeatType: "reverse"
                    }
                  }}
                  className={`p-2 rounded-full ${effectColors[effect as PowerUpType]} backdrop-blur-sm flex items-center gap-2 ${
                    effect === 'shield' ? 'shadow-lg shadow-purple-500/50 ring-2 ring-purple-300/50' : ''
                  }`}
                >
                  {effect === 'speedBoost' && <BoltIcon className="w-4 h-4 text-white" />}
                  {effect === 'shield' && <SparklesIcon className="w-4 h-4 text-white" />}
                  <span className={`text-white font-medium ${effect === 'shield' ? 'text-sm' : 'text-xs hidden sm:inline'}`}>
                    {effect === 'speedBoost' ? 'Speed Boost' : 'Shield activated!'}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      {isMobile && gameStarted && (
        <div className="mt-8 select-none">
          {/* Directional Controls */}
          <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
            {/* Up */}
            <div className="col-start-2">
              <button
                onClick={() => handleMobileControl('UP')}
                className="w-16 h-16 rounded-full bg-indigo-500/80 hover:bg-indigo-500 active:bg-indigo-600 flex items-center justify-center backdrop-blur-sm"
              >
                <ChevronUpIcon className="w-8 h-8 text-white" />
              </button>
            </div>
            
            {/* Left */}
            <div className="col-start-1 row-start-2">
              <button
                onClick={() => handleMobileControl('LEFT')}
                className="w-16 h-16 rounded-full bg-indigo-500/80 hover:bg-indigo-500 active:bg-indigo-600 flex items-center justify-center backdrop-blur-sm"
              >
                <ChevronLeftIcon className="w-8 h-8 text-white" />
              </button>
            </div>
            
            {/* Pause/Resume */}
            <div className="col-start-2 row-start-2">
              <button
                onClick={() => setIsPaused(prev => !prev)}
                className="w-16 h-16 rounded-full bg-indigo-500/80 hover:bg-indigo-500 active:bg-indigo-600 flex items-center justify-center backdrop-blur-sm"
              >
                {isPaused ? (
                  <PlayIcon className="w-8 h-8 text-white" />
                ) : (
                  <PauseIcon className="w-8 h-8 text-white" />
                )}
              </button>
            </div>
            
            {/* Right */}
            <div className="col-start-3 row-start-2">
              <button
                onClick={() => handleMobileControl('RIGHT')}
                className="w-16 h-16 rounded-full bg-indigo-500/80 hover:bg-indigo-500 active:bg-indigo-600 flex items-center justify-center backdrop-blur-sm"
              >
                <ChevronRightIcon className="w-8 h-8 text-white" />
              </button>
            </div>
            
            {/* Down */}
            <div className="col-start-2 row-start-3">
              <button
                onClick={() => handleMobileControl('DOWN')}
                className="w-16 h-16 rounded-full bg-indigo-500/80 hover:bg-indigo-500 active:bg-indigo-600 flex items-center justify-center backdrop-blur-sm"
              >
                <ChevronDownIcon className="w-8 h-8 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 