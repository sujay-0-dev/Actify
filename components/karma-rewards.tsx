"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Gift, Star, TrendingUp, Trophy, MapPin, Users, CheckCircle, MessageSquare } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { getUserKarma, getRewards, redeemReward, type KarmaResponse, type RewardItem } from "@/services/karma-api"
import { useToast } from "@/components/ui/use-toast"

export default function KarmaRewards() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [karmaData, setKarmaData] = useState<KarmaResponse | null>(null)
  const [rewards, setRewards] = useState<RewardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (user?.userId) {
        setIsLoading(true)
        try {
          const [karmaResponse, rewardsResponse] = await Promise.all([getUserKarma(user.userId), getRewards()])

          setKarmaData(karmaResponse)
          setRewards(rewardsResponse)
        } catch (error) {
          console.error("Failed to load karma data:", error)
          toast({
            title: "Error",
            description: "Failed to load karma data. Please try again later.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadData()
  }, [user, toast])

  const handleRedeemReward = async (rewardId: number) => {
    if (!user?.userId) return

    try {
      const success = await redeemReward(user.userId, rewardId)

      if (success) {
        toast({
          title: "Success!",
          description: "Reward redeemed successfully.",
        })

        // Refresh karma data
        const updatedKarma = await getUserKarma(user.userId)
        setKarmaData(updatedKarma)
      } else {
        toast({
          title: "Error",
          description: "Failed to redeem reward. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error redeeming reward:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Use fallback values if API data isn't available yet
  const karmaPoints = karmaData?.points || 450
  const level = karmaData?.level || 3
  const nextLevelPoints = karmaData?.nextLevelPoints || 600
  const progress = Math.round((karmaPoints / nextLevelPoints) * 100)

  // Use API badges if available, otherwise use fallback
  const badges = karmaData?.badges || [
    {
      id: 1,
      name: "First Report",
      description: "Submitted your first hazard report",
      icon: "MapPin",
      earned: true,
      points: 10,
    },
    {
      id: 2,
      name: "Helpful Neighbor",
      description: "Helped 5 community members",
      icon: "Users",
      earned: true,
      points: 50,
    },
    {
      id: 3,
      name: "Problem Solver",
      description: "10 of your reported issues were resolved",
      icon: "CheckCircle",
      earned: true,
      points: 100,
    },
    {
      id: 4,
      name: "Community Leader",
      description: "Started a discussion with 50+ participants",
      icon: "MessageSquare",
      earned: false,
      points: 200,
    },
    {
      id: 5,
      name: "Skill Master",
      description: "Received 20 positive reviews for your skills",
      icon: "Award",
      earned: false,
      points: 300,
    },
  ]

  // Map icon strings to actual components
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      MapPin: <MapPin className="w-6 h-6" />,
      Users: <Users className="w-6 h-6" />,
      CheckCircle: <CheckCircle className="w-6 h-6" />,
      MessageSquare: <MessageSquare className="w-6 h-6" />,
      Award: <Award className="w-6 h-6" />,
    }

    return iconMap[iconName] || <Award className="w-6 h-6" />
  }

  return (
    <section id="rewards" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-start justify-between gap-4 mb-12 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Karma & Rewards System</h2>
            <p className="text-muted-foreground mt-2 md:text-lg max-w-[600px]">
              Earn Karma points for your community contributions and redeem exciting rewards
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Karma Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-muted">
                      <Trophy className="w-12 h-12 text-primary" />
                    </div>
                    <Badge className="absolute px-3 py-1 -bottom-2 -right-2 bg-gradient-to-r from-primary to-blue-600">
                      Level {level}
                    </Badge>
                  </div>
                  <h3 className="mt-4 text-2xl font-bold">{karmaPoints} Karma</h3>
                  <p className="text-sm text-muted-foreground">Community Trust Score</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level {level}</span>
                    <span>Level {level + 1}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    {nextLevelPoints - karmaPoints} more Karma points to reach Level {level + 1}
                  </p>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm">Karma Growth</span>
                    </div>
                    <span className="text-sm font-medium">+45 this week</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-500" />
                      <span className="text-sm">Trust Ranking</span>
                    </div>
                    <span className="text-sm font-medium">Top 10%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <Button className="w-full">View Detailed Stats</Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="badges" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
                <TabsTrigger value="rewards">Redeem Rewards</TabsTrigger>
              </TabsList>

              <TabsContent value="badges" className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {badges.map((badge) => (
                    <Card
                      key={badge.id}
                      className={`overflow-hidden transition-shadow duration-300 ${badge.earned ? "border-primary/50" : "opacity-70"}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${badge.earned ? "bg-primary/10" : "bg-muted"}`}
                          >
                            {badge.icon && typeof badge.icon === "string" ? (
                              getIconComponent(badge.icon)
                            ) : (
                              <Award className={`h-6 w-6 ${badge.earned ? "text-primary" : "text-muted-foreground"}`} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{badge.name}</h4>
                            <p className="text-sm text-muted-foreground">{badge.description}</p>
                            <div className="flex items-center mt-2">
                              <Badge variant={badge.earned ? "default" : "outline"} className="text-xs">
                                {badge.earned ? "Earned" : "Locked"} • {badge.points} Karma
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button variant="outline">View All Badges</Button>
                </div>
              </TabsContent>

              <TabsContent value="rewards" className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {isLoading ? (
                    <p className="col-span-2 text-center">Loading rewards...</p>
                  ) : rewards.length > 0 ? (
                    rewards.map((reward) => (
                      <Card key={reward.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 overflow-hidden rounded-md bg-muted">
                              <Image
                                src={reward.image || "/placeholder.svg?height=64&width=64"}
                                alt={reward.name}
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{reward.name}</h4>
                              <p className="text-sm text-muted-foreground">{reward.description}</p>
                              <div className="flex items-center justify-between mt-2">
                                <Badge variant="outline" className="text-xs">
                                  <Gift className="w-3 h-3 mr-1" /> {reward.points} Karma
                                </Badge>
                                <Button
                                  size="sm"
                                  variant={karmaPoints >= reward.points ? "default" : "outline"}
                                  disabled={karmaPoints < reward.points}
                                  onClick={() => handleRedeemReward(reward.id)}
                                >
                                  Redeem
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="col-span-2 text-center">No rewards available at the moment.</p>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <Button variant="outline">View All Rewards</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}
