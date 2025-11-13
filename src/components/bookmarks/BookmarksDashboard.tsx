import { useState } from 'react'

import { Loader2, Plus, Trash2, Upload } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { CSVImportDialog } from './CSVImportDialog'
import { useBookmarks } from '@/hooks/useBookmarks'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'

const PER_PAGE = 10

export function BookmarksDashboard() {
  const [page, setPage] = useState(1)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const { listQuery, deleteBookmark, deleteLoading } = useBookmarks(
    page,
    PER_PAGE,
  )

  const bookmarks = listQuery.data?.data ?? []
  const pagination = listQuery.data?.pagination
  console.log(pagination)
  const isLoading = listQuery.isLoading || listQuery.isFetching

  async function handleDelete(id: string) {
    try {
      setPendingDeleteId(id)
      await deleteBookmark(id)
    } finally {
      setPendingDeleteId(null)
    }
  }

  const canGoPrev = (pagination?.page ?? 1) > 1
  const canGoNext = pagination && pagination.page < pagination.total_pages

  return (
    <main className="container mx-auto px-4 py-16 space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">My Bookmarks</h1>
          <p className="text-muted-foreground">
            Track your saved repositories and keep them organized.
          </p>
        </div>
        <div className="flex gap-3">
          <CSVImportDialog />
          <Link to="/search">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add more
            </Button>
          </Link>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <StatCard title="Total Bookmarks" value={pagination?.total ?? 0} />
        <StatCard
          title="Bookmarks per page"
          value={PER_PAGE}
          description="You can adjust this later."
        />
      </section>

      <Card className="bg-card/60">
        <CardHeader>
          <CardTitle>Bookmarked Repositories</CardTitle>
          <CardDescription>
            Use the search page to add more repositories. Deleting here removes
            them from bookmarks only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable />
          ) : bookmarks.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No bookmarks yet. Use the search page to add your first
              repository.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repository</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="hidden md:table-cell text-right">
                      Stars
                    </TableHead>
                    <TableHead className="hidden md:table-cell text-right">
                      Forks
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Language
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Added
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookmarks.map((bookmark) => (
                    <TableRow key={bookmark.id}>
                      <TableCell className="font-medium">
                        <a
                          href={bookmark.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {bookmark.repo_name}
                        </a>
                        {bookmark.repo_description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {bookmark.repo_description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>{bookmark.owner_username}</TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        {bookmark.repo_stars.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        {bookmark.repo_forks.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {bookmark.repo_language ? (
                          <Badge variant="secondary">
                            {bookmark.repo_language}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            Unknown
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {formatDate(bookmark.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(bookmark.id)}
                          disabled={
                            deleteLoading && pendingDeleteId === bookmark.id
                          }
                          className="text-destructive hover:text-destructive"
                        >
                          {deleteLoading && pendingDeleteId === bookmark.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-6">
                <span className="text-sm text-muted-foreground">
                  Page {pagination?.page ?? page} of{' '}
                  {pagination?.total_pages ?? 1}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={!canGoPrev}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!canGoNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string
  value: number | string
  description?: string
}) {
  return (
    <Card className="bg-card/60">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <span className="text-3xl font-semibold text-primary">{value}</span>
      </CardContent>
    </Card>
  )
}

function LoadingTable() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-12 w-full rounded-md bg-muted/20" />
      <Skeleton className="h-12 w-full rounded-md bg-muted/20" />
      <Skeleton className="h-12 w-full rounded-md bg-muted/20" />
    </div>
  )
}
