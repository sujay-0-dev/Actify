import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Lock } from "lucide-react"

export default function AchievementBadge({
  name,
  description,
  icon: Icon,
  status = "locked", // locked, unlocked, bronze, silver, gold, platinum
  progress = 0,
  total = 1,
  className,
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex flex-col items-center", className)}>
            <div className={cn("achievement-badge", status)}>
              {status === "locked" ? <Lock className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
              {progress > 0 && progress < total && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-white px-1.5 py-0.5 text-xs font-medium text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                  {progress}/{total}
                </div>
              )}
            </div>
            <span className="mt-2 text-center text-xs font-medium text-gray-700 dark:text-gray-300">{name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="space-y-1 p-1">
            <p className="font-medium">{name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            {progress > 0 && (
              <div className="mt-1 text-xs">
                Progress: {progress}/{total}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
