import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AppLayout from "./layouts/app-layout"
import LandingPage from "./pages/landing"
import Dashboard from "./pages/dashboard"
import Link from "./pages/link"
import Auth from "./pages/auth"
import RedirctLink from "./pages/redirect-link"
import UrlProvider from "./context"
import RequireAuth from "./components/require-auth"
import RedirectLink from "./pages/redirect-link"
import LinkPage from "./pages/link"
import Settings from "./pages/settings"



const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: "/link/:id",
        element: (
          <RequireAuth>
            <LinkPage />
          </RequireAuth>
        ),
      },
      {
        path: "/:id",
        element: <RedirectLink />,
      },
      {
  path: "/settings",
  element: <Settings />
}
    ],
  },
]);

export default function App() {
  return ( 
     <UrlProvider>
    <RouterProvider router={router} />
  </UrlProvider>
  )
}