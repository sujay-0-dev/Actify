import { Star, Award, Trophy, Crown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const LEVEL_CONFIG = {
  1: {
    name: "Beginner",
    icon: Star,
    color: "text-green-500 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    borderColor: "border-green-200 dark:border-green-800",
  },
  2: {
    name: "Intermediate",
    icon: Award,
    color: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  3: {
    name: "Advanced",
    icon: Trophy,
    color: "text-indigo-500 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
  4: {
    name: "Expert",
    icon: Crown,
    color: "text-purple-500 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  5: {
    name: "Master",
    icon: Sparkles,
    color: "text-pink-500 dark:text-pink-400",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    borderColor: "border-pink-200 dark:border-pink-800",
  },
}

export default function LevelBadge({ level = 1, size = "md", showLabel = false, className }) {
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[1]
  const Icon = config.icon

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-base",
    xl: "h-20 w-20 text-lg",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-8 w-8",
    xl: "h-10 w-10",
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full border-2",
          config.borderColor,
          config.bgColor,
          sizeClasses[size],
        )}
      >
        <Icon className={cn(config.color, iconSizes[size])} />
      </div>
      {showLabel && (
        <span
          className={cn("mt-1 font-medium", config.color, {
            "text-xs": size === "sm",
            "text-sm": size === "md",
            "text-base": size === "lg",
            "text-lg": size === "xl",
          })}
        >
          {config.name}
        </span>
      )}
    </div>
  )
}
