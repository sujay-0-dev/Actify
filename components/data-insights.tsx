import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { BarChart3, LineChartIcon, PieChartIcon, Download, Share2 } from "lucide-react"

export default function DataInsights() {
  // Sample data for charts
  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Hazards Reported",
        data: [65, 78, 86, 61, 98, 110],
        backgroundColor: "hsl(var(--primary))",
      },
      {
        label: "Issues Resolved",
        data: [40, 65, 75, 50, 85, 95],
        backgroundColor: "hsl(var(--primary) / 0.3)",
      },
    ],
  }

  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Community Engagement",
        data: [100, 120, 115, 134, 168, 180],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "transparent",
      },
      {
        label: "Karma Points Earned",
        data: [80, 100, 95, 110, 140, 160],
        borderColor: "hsl(var(--primary) / 0.5)",
        backgroundColor: "transparent",
      },
    ],
  }

  const pieChartData = {
    labels: ["Potholes", "Broken Lights", "Garbage", "Water Issues", "Others"],
    datasets: [
      {
        label: "Hazard Types",
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          "hsl(var(--primary))",
          "hsl(var(--primary) / 0.8)",
          "hsl(var(--primary) / 0.6)",
          "hsl(var(--primary) / 0.4)",
          "hsl(var(--primary) / 0.2)",
        ],
      },
    ],
  }

  return (
    <section id="data-insights" className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">AI-Powered Data Insights</h2>
            <p className="text-muted-foreground mt-2 md:text-lg max-w-[600px]">
              Analyze community data and trends to make informed decisions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export Data
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" /> Share Insights
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Hazards</CardTitle>
              <CardDescription>All time reported issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">2,543</div>
                <div className="text-sm text-green-500 flex items-center">+12% from last month</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resolution Rate</CardTitle>
              <CardDescription>Issues successfully resolved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">78%</div>
                <div className="text-sm text-green-500 flex items-center">+5% from last month</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Users</CardTitle>
              <CardDescription>Monthly active participants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">1,245</div>
                <div className="text-sm text-green-500 flex items-center">+18% from last month</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3">
            <TabsTrigger value="trends" className="flex items-center">
              <LineChartIcon className="h-4 w-4 mr-2" /> Trends
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center">
              <PieChartIcon className="h-4 w-4 mr-2" /> Distribution
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" /> Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Engagement Trends</CardTitle>
                <CardDescription>Six-week trend of community activity and karma points earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart
                    data={lineChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Hazard Type Distribution</CardTitle>
                <CardDescription>Breakdown of different types of hazards reported</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <PieChart
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Hazards Reported vs. Resolved</CardTitle>
                <CardDescription>Monthly comparison of reported hazards and resolution rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Insights</CardTitle>
              <CardDescription>AI-powered predictions and recommendations for community improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Key Findings</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-primary">1</span>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Hotspot Identification:</span> Sector 7 shows a 35% increase in
                        infrastructure-related issues.
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-primary">2</span>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Seasonal Patterns:</span> Garbage-related issues increase by 28%
                        during monsoon season.
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-primary">3</span>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Community Engagement:</span> Events with skill-sharing components
                        see 45% higher participation.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recommendations</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-green-500">✓</span>
                      </div>
                      <p className="text-sm">Allocate additional resources to Sector 7 infrastructure maintenance.</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-green-500">✓</span>
                      </div>
                      <p className="text-sm">Implement pre-monsoon waste management campaign in identified areas.</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-green-500">✓</span>
                      </div>
                      <p className="text-sm">Organize monthly skill-sharing workshops to boost community engagement.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
