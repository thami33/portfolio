import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GradientCardProps {
  children: React.ReactNode
  gradient?: string
  className?: string
}

export function GradientCard({
  children,
  gradient = "from-blue-500 to-cyan-500",
  className,
}: GradientCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl p-8 overflow-hidden isolate",
        "bg-gray-900/50 backdrop-blur-xl",
        "ring-1 ring-gray-800/50 hover:ring-gray-700/50",
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={cn(
        "absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        gradient
      )} />
      {children}
    </motion.div>
  )
} 