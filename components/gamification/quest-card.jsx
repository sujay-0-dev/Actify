"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Award, ArrowRight } from "lucide-react"

export default function QuestCard({
  title,
  description,
  difficulty = "medium",
  reward = 0,
  progress = 0,
  total = 1,
  timeLeft,
  status = "active",
  actionUrl,
  actionText = "Start Quest",
}) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const handleAction = () => {
    router.push(actionUrl)
  }

  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
      case "medium":
        return "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
      case "hard":
        return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
    }
  }

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400"
      case "completed":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
      case "expired":
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400"
      default:
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
    }
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${isHovered ? "shadow-md" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
            <Badge className={getDifficultyColor()}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</Badge>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>

          <div className="mt-auto space-y-3">
            {progress > 0 || total > 1 ? (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {progress}/{total}
                  </span>
                </div>
                <Progress value={(progress / total) * 100} className="h-1.5" />
              </div>
            ) : null}

            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>{timeLeft}</span>
              </div>
              <div className="flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
                <Award className="h-3 w-3 mr-1" />
                <span>+{reward} Karma</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Badge className={`${getStatusColor()}`}>{status}</Badge>
              <Button
                size="sm"
                className="text-xs h-8"
                onClick={handleAction}
                disabled={status.toLowerCase() === "completed" || status.toLowerCase() === "expired"}
              >
                {actionText} <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
