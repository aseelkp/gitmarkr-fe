import { Link } from '@tanstack/react-router'
import { BarChart3, Bookmark, Home, LogOut, Search, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo/App Name */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Gitmarkr</span>
          </Link>

          {/* Navigation Links - Only show when authenticated */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/search"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                activeProps={{
                  className: 'bg-accent text-accent-foreground',
                }}
              >
                <Search className="h-4 w-4" />
                Search
              </Link>
              <Link
                to="/bookmarks"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                activeProps={{
                  className: 'bg-accent text-accent-foreground',
                }}
              >
                <Bookmark className="h-4 w-4" />
                Bookmarks
              </Link>
              <Link
                to="/analytics"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                activeProps={{
                  className: 'bg-accent text-accent-foreground',
                }}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
            </nav>
          )}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-md">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {user?.username.charAt(0).toUpperCase() +
                    user?.username.slice(1) || 'User'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
