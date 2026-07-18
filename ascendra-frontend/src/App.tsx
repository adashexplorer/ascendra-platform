import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { routes } from './routes'
import { useThemeStore } from './stores/themeStore'

const router = createBrowserRouter(routes)

export function App() {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return <RouterProvider router={router} />
}
