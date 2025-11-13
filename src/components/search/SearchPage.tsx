import { useState } from 'react'
import {
  Bookmark,
  BookmarkCheck,
  Code,
  ExternalLink,
  GitBranch,
  GitFork,
  ListFilter,
  Loader2,
  SearchIcon,
  Star,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import type { GitHubRepository, GitHubUser } from '@/lib/types'
import { useSearch } from '@/hooks/useSearch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export function SearchPage() {
  const [userQuery, setUserQuery] = useState('')
  const [repoQuery, setRepoQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<GitHubUser | null>(null)
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(
    null,
  )
  const {
    searchUsers,
    usersResult,
    usersLoading,
    searchRepositories,
    repositoriesResult,
    repositoriesLoading,
    searchUserRepos,
    userReposResult,
    userReposLoading,
    bookmarkRepository,
    bookmarkLoading,
    deleteBookmark,
    deleteBookmarkLoading,
  } = useSearch()

  const handleBackToUsers = () => {
    setSelectedUser(null)
    setSelectedRepo(null)
  }

  const handleToggleBookmark = async (repo: GitHubRepository) => {
    try {
      if (selectedRepo?.id === repo.id) {
        setSelectedRepo({
          ...selectedRepo,
          is_bookmarked: !selectedRepo.is_bookmarked,
          bookmark_id: selectedRepo.is_bookmarked
            ? selectedRepo.bookmark_id
            : null,
        })
      }

      if (repo.is_bookmarked) {
        await deleteBookmark(repo.bookmark_id ?? '')
      } else {
        await bookmarkRepository({
          repo_name: repo.name,
          repo_url: repo.html_url,
          repo_description: repo.description,
          repo_stars: repo.stargazers_count,
          repo_forks: repo.forks_count,
          repo_language: repo.language,
          owner_username: repo.owner.login,
          bookmarked_at: new Date().toLocaleString(),
        })
      }
      if (selectedUser) {
        const updatedData = await searchUserRepos({
          username: selectedUser.login,
        })

        const updatedRepos = updatedData.data ?? []
        const updatedRepo = updatedRepos.find((r) => r.id === repo.id)
        if (updatedRepo && selectedRepo?.id === repo.id) {
          setSelectedRepo(updatedRepo)
        }
      }
    } catch (error) {
      if (selectedRepo?.id === repo.id) {
        setSelectedRepo({
          ...selectedRepo,
          is_bookmarked: !selectedRepo.is_bookmarked,
          bookmark_id: selectedRepo.is_bookmarked
            ? selectedRepo.bookmark_id
            : null,
        })
      }
      toast.error((error as Error).message || 'Failed to toggle bookmark')
    }
  }

  const handleUserSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userQuery.trim()) return

    try {
      await searchUsers({ query: userQuery.trim() })
    } catch (error) {
      // Error handled in hook
    }
  }

  const handleRepoSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!repoQuery.trim()) return

    try {
      await searchRepositories({ query: repoQuery.trim() })
    } catch (error) {
      // Error handled in hook
    }
  }

  const handleViewUserRepos = async (user: GitHubUser) => {
    setSelectedUser(user)
    try {
      await searchUserRepos({ username: user.login })
    } catch (error) {
      // Error handled in hook
    }
  }

  const handleBookmark = async (repo: GitHubRepository) => {
    try {
      await bookmarkRepository({
        repo_name: repo.name,
        repo_url: repo.html_url,
        repo_description: repo.description,
        repo_stars: repo.stargazers_count,
        repo_forks: repo.forks_count,
        repo_language: repo.language,
        owner_username: repo.owner.login,
        bookmarked_at: new Date().toLocaleString(),
      })
      setSelectedRepo(repo)
    } catch (error) {
      // Error handled in hook
    }
  }

  return (
    <main className="container mx-auto px-4 py-16 space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Search GitHub</h1>
          <p className="text-muted-foreground">
            Find GitHub users or repositories, preview metadata, and add them to
            your bookmarks.
          </p>
        </div>
        <Button variant="outline" className="gap-2" disabled>
          <ListFilter className="h-4 w-4" />
          Filters
        </Button>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {/* User Search Card */}
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Search GitHub Users
            </CardTitle>
            <CardDescription>
              Enter a username to view profile details and list their
              repositories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUserSearch} className="space-y-4">
              <Input
                placeholder="e.g. facebook"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                disabled={usersLoading}
              />
              <Button
                type="submit"
                className="gap-2 w-full"
                disabled={usersLoading || !userQuery.trim()}
              >
                {usersLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon className="h-4 w-4" />
                    Search users
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Repository Search Card */}
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              Search Repositories
            </CardTitle>
            <CardDescription>
              Lookup repositories directly by keyword or owner/name pair.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRepoSearch} className="space-y-4">
              <Input
                placeholder="e.g. tailwindcss"
                value={repoQuery}
                onChange={(e) => setRepoQuery(e.target.value)}
                disabled={repositoriesLoading}
              />
              <Button
                type="submit"
                className="gap-2 w-full"
                disabled={repositoriesLoading || !repoQuery.trim()}
              >
                {repositoriesLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon className="h-4 w-4" />
                    Search repositories
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Results Section */}
      <section className="grid gap-6 md:grid-cols-[2fr_3fr]">
        {/* Results List */}
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              {selectedUser !== null
                ? `${userReposResult.length} repository(ies) from ${selectedUser.login}`
                : usersResult.length > 0
                  ? `${usersResult.length} user(s) found`
                  : repositoriesResult.length > 0
                    ? `${repositoriesResult.length} repository(ies) found`
                    : 'No results yet'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
            {selectedUser !== null && (
              <div className="flex items-center justify-between mb-4 pb-3 border-b">
                <h4 className="font-semibold text-sm">
                  {selectedUser.login}'s Repositories
                </h4>
                <Button variant="ghost" size="sm" onClick={handleBackToUsers}>
                  ← Back to users
                </Button>
              </div>
            )}

            {/* User Results */}
            {selectedUser === null && usersResult.length > 0 && (
              <>
                {usersResult.map((user) => (
                  <Card
                    key={user.id}
                    className={`cursor-pointer transition-colors hover:bg-accent ${
                      selectedUser?.id === user.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => handleViewUserRepos(user)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar_url}
                          alt={user.login}
                          className="h-12 w-12 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {user.login}
                          </h3>
                          {user.name && (
                            <p className="text-sm text-muted-foreground truncate">
                              {user.name}
                            </p>
                          )}
                          <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                            {user.public_repos !== undefined && (
                              <span>{user.public_repos} repos</span>
                            )}
                            {user.followers !== undefined && (
                              <span>{user.followers} followers</span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewUserRepos(user)
                          }}
                        >
                          View Repos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
            {/* Repository Results */}
            {selectedUser === null && repositoriesResult.length > 0 && (
              <>
                {repositoriesResult.map((repo) => (
                  <Card
                    key={repo.id}
                    className={`cursor-pointer transition-colors hover:bg-accent ${
                      selectedRepo?.id === repo.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedRepo(repo)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">
                              {repo.name}
                            </h3>
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </a>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {repo.description || 'No description'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {repo.stargazers_count.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" />
                              {repo.forks_count.toLocaleString()}
                            </span>
                            {repo.language && (
                              <Badge variant="secondary" className="text-xs">
                                {repo.language}
                              </Badge>
                            )}
                            {repo.is_bookmarked && (
                              <Badge variant="default" className="text-xs">
                                Bookmarked
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant={repo.is_bookmarked ? 'default' : 'outline'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBookmark(repo)
                          }}
                          disabled={bookmarkLoading || deleteBookmarkLoading}
                          className="gap-2"
                        >
                          {bookmarkLoading || deleteBookmarkLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : repo.is_bookmarked ? (
                            <>
                              <BookmarkCheck className="h-4 w-4" />
                              <span className="hidden sm:inline">Remove</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="h-4 w-4" />
                              <span className="hidden sm:inline">Bookmark</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {/* User Repos Results */}
            {selectedUser !== null && userReposResult.length > 0 && (
              <>
                {userReposResult.map((repo: GitHubRepository) => (
                  <Card
                    key={repo.id}
                    className={`cursor-pointer transition-colors hover:bg-accent ${
                      selectedRepo?.id === repo.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedRepo(repo)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">
                              {repo.name}
                            </h3>
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </a>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {repo.description || 'No description'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {repo.stargazers_count.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" />
                              {repo.forks_count.toLocaleString()}
                            </span>
                            {repo.language && (
                              <Badge variant="secondary" className="text-xs">
                                {repo.language}
                              </Badge>
                            )}
                            {repo.is_bookmarked && (
                              <Badge variant="default" className="text-xs">
                                Bookmarked
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant={repo.is_bookmarked ? 'default' : 'outline'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleBookmark(repo)
                          }}
                          disabled={bookmarkLoading || deleteBookmarkLoading}
                          className="gap-2"
                        >
                          {bookmarkLoading || deleteBookmarkLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : repo.is_bookmarked ? (
                            <>
                              <BookmarkCheck className="h-4 w-4" />
                              <span className="hidden sm:inline">Remove</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="h-4 w-4" />
                              <span className="hidden sm:inline">Bookmark</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {/* Loading State */}
            {(usersLoading || repositoriesLoading || userReposLoading) && (
              <div className="space-y-3">
                <Skeleton className="h-20 rounded-lg bg-muted/20" />
                <Skeleton className="h-20 rounded-lg bg-muted/20" />
                <Skeleton className="h-20 rounded-lg bg-muted/20" />
              </div>
            )}

            {/* Empty State */}
            {!usersLoading &&
              !repositoriesLoading &&
              !userReposLoading &&
              usersResult.length === 0 &&
              repositoriesResult.length === 0 &&
              userReposResult.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Start searching to see results here
                </p>
              )}
          </CardContent>
        </Card>

        {/* Selected Repository Preview */}
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle>Repository Details</CardTitle>
            <CardDescription>
              {selectedRepo
                ? 'Click the bookmark icon to save this repository'
                : 'Select a repository to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedRepo ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">
                        {selectedRepo.full_name}
                      </h3>
                      <a
                        href={selectedRepo.html_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedRepo.description || 'No description available'}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleToggleBookmark(selectedRepo)}
                    disabled={bookmarkLoading}
                    className="gap-2"
                  >
                    {bookmarkLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {selectedRepo.is_bookmarked ? (
                          <BookmarkCheck className="h-4 w-4" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                        {selectedRepo.is_bookmarked
                          ? 'Remove Bookmark'
                          : 'Bookmark'}
                      </>
                    )}
                  </Button>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Owner</p>
                    <div className="flex items-center gap-2 mt-1">
                      <img
                        src={selectedRepo.owner.avatar_url}
                        alt={selectedRepo.owner.login}
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="text-sm">
                        {selectedRepo.owner.login}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Language</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedRepo.language || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Stars</p>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {selectedRepo.stargazers_count.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Forks</p>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      {selectedRepo.forks_count.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Metadata</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      Created:{' '}
                      {new Date(selectedRepo.created_at).toLocaleDateString()}
                    </p>
                    <p>
                      Updated:{' '}
                      {new Date(selectedRepo.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No repository selected</p>
                <p className="text-xs mt-2">
                  Click on a repository from the results to view details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
