import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createRouter,
} from '@tanstack/react-router'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

import './styles.css'

import { loginRoute } from './routes/login.tsx'
import { registerRoute } from './routes/register.tsx'
import { rootRoute } from './routes/__root.tsx'
import { indexRoute } from './routes/index.tsx'
import { bookmarksRoute } from './routes/bookmarks.tsx'
import { searchRoute } from './routes/search.tsx'
import { analyticsRoute } from './routes/analytics.tsx'




const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  bookmarksRoute,
  searchRoute,
  analyticsRoute,
])

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <RouterProvider router={router} />
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}
