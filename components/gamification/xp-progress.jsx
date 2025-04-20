import { cn } from "@/lib/utils"

export default function XpProgress({
  currentXp = 0,
  nextLevelXp = 100,
  level = 1,
  showValues = true,
  showLevel = true,
  className,
}) {
  const progress = Math.min(Math.round((currentXp / nextLevelXp) * 100), 100)

  const levelClass =
    level <= 1
      ? "beginner"
      : level === 2
        ? "intermediate"
        : level === 3
          ? "advanced"
          : level === 4
            ? "expert"
            : "master"

  return (
    <div className={cn("space-y-1", className)}>
      {(showValues || showLevel) && (
        <div className="flex justify-between text-xs">
          {showValues && (
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{currentXp}</span>
              <span> / {nextLevelXp} XP</span>
            </div>
          )}
          {showLevel && (
            <div className="text-gray-600 dark:text-gray-400">
              Level <span className="font-medium">{level}</span>
            </div>
          )}
        </div>
      )}
      <div className={cn("xp-progress-bar", levelClass)}>
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
