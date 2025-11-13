import { TrendingUp } from 'lucide-react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useBookmarks } from '@/hooks/useBookmarks'
import { formatDate } from '@/lib/utils'

const PER_PAGE = 10

export function AnalyticsPage() {
  const { analytics, isLoading } = useAnalytics()
  const { listQuery } = useBookmarks(1, PER_PAGE)
  const bookmarks = listQuery.data?.data ?? []
  const pagination = listQuery.data?.pagination

  const uniqueOwners = new Set(bookmarks.map((b) => b.owner_username)).size
  const languageCounts = bookmarks.reduce(
    (acc, b) => {
      if (b.repo_language) {
        acc[b.repo_language] = (acc[b.repo_language] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const mostPopularLanguage =
    Object.entries(languageCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    'N/A'

  const chartData = analytics.map((item) => ({
    date: formatDate(item.date),
    count: item.count.toLocaleString(),
  }))

  return (
    <main className="container mx-auto px-4 py-16 space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Bookmark Analytics</h1>
          <p className="text-muted-foreground">
            Track when repositories were added and understand bookmarking trends
            over time.
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card/60">
          <CardHeader>
            <CardTitle>Total Bookmarks</CardTitle>
            <CardDescription>All-time saved repositories</CardDescription>
          </CardHeader>
          <CardContent>
            {listQuery.isLoading ? (
              <Skeleton className="h-12 w-24 rounded bg-muted/20" />
            ) : (
              <span className="text-3xl font-semibold text-primary">
                {pagination?.total ?? 0}
              </span>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/60">
          <CardHeader>
            <CardTitle>Active Owners</CardTitle>
            <CardDescription>Unique GitHub users bookmarked</CardDescription>
          </CardHeader>
          <CardContent>
            {listQuery.isLoading ? (
              <Skeleton className="h-12 w-24 rounded bg-muted/20" />
            ) : (
              <span className="text-3xl font-semibold text-primary">
                {uniqueOwners}
              </span>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/60">
          <CardHeader>
            <CardTitle>Most Popular Language</CardTitle>
            <CardDescription>Based on bookmarks</CardDescription>
          </CardHeader>
          <CardContent>
            {listQuery.isLoading ? (
              <Skeleton className="h-12 w-32 rounded bg-muted/20" />
            ) : (
              <span className="text-2xl font-semibold text-primary">
                {mostPopularLanguage}
              </span>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Chart */}
      <Card className="bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Bookmarks Over Time
          </CardTitle>
          <CardDescription>
            Number of repositories bookmarked per day
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[320px] rounded-xl bg-muted/20" />
          ) : chartData.length === 0 ? (
            <div className="h-[320px] flex items-center justify-center text-muted-foreground">
              <p>No analytics data available yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Bookmarks"
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle>Recent Bookmark Activity</CardTitle>
          <CardDescription>
            Latest bookmarks added to your collection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {listQuery.isLoading ? (
            <>
              <Skeleton className="h-20 rounded-lg bg-muted/20" />
              <Skeleton className="h-20 rounded-lg bg-muted/20" />
              <Skeleton className="h-20 rounded-lg bg-muted/20" />
            </>
          ) : bookmarks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No bookmarks yet
            </p>
          ) : (
            bookmarks.slice(0, 5).map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card/40"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{bookmark.repo_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {bookmark.owner_username} •{' '}
                    {formatDate(bookmark.bookmarked_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {bookmark.repo_stars.toLocaleString()} ⭐
                  </p>
                  {bookmark.repo_language && (
                    <p className="text-xs text-muted-foreground">
                      {bookmark.repo_language}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  )
}
