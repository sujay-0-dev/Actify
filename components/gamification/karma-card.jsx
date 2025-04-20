import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import LevelBadge from "@/components/gamification/level-badge"
import XpProgress from "@/components/gamification/xp-progress"
import { Sparkles, TrendingUp, Award } from "lucide-react"

export default function KarmaCard({ karma = 0, level = 1, nextLevelKarma = 100, rank = "Newcomer", className }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-900/30 dark:to-purple-900/30" />
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Karma Points</h3>
              <div className="flex items-center text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {karma}
                <Sparkles className="ml-2 h-5 w-5 text-amber-500" />
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span>+15 this week</span>
              </div>
            </div>

            <LevelBadge level={level} size="lg" showLabel={true} />
          </div>

          <div className="mt-4 space-y-3">
            <XpProgress currentXp={karma} nextLevelXp={nextLevelKarma} level={level} />

            <div className="flex items-center justify-between rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
              <div className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Community Rank</span>
              </div>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{rank}</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
