import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PublicIssuesLoading() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-3/4 bg-white/20 mb-4" />
            <Skeleton className="h-6 w-full bg-white/20 mb-2" />
            <Skeleton className="h-6 w-2/3 bg-white/20 mb-6" />
            <Skeleton className="h-10 w-40 bg-white/20" />
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Skeleton className="h-10 flex-1 bg-gray-200 dark:bg-gray-800" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 bg-gray-200 dark:bg-gray-800" />
              <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>

          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 min-w-max pb-2">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Skeleton key={i} className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded-full" />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>
                  <Skeleton className="h-6 w-40 bg-gray-200 dark:bg-gray-800" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[500px] w-full bg-gray-200 dark:bg-gray-800 rounded-md" />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>
                    <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-gray-800" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-800 mt-4" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>
                    <Skeleton className="h-6 w-40 bg-gray-200 dark:bg-gray-800" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-24 bg-gray-200 dark:bg-gray-800 mb-1" />
                          <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-800" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
