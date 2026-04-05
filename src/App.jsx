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
import AdminDashboard from "./pages/admin/admin-dashboard"
import RequireAdmin from "./components/admin/require-admin"
import BanCheckWrapper from "./components/admin/BanCheckWrapper"
import ResetPassword from "./pages/reset-password"
import Blog from "./pages/blog"
import BlogDetail from "./pages/blog-detail"

const router = createBrowserRouter([
  // Short URL redirect — no layout, no header
  {
    path: "/:id",
    element: <RedirectLink />,
  },
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
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/blog/:id",
        element: <BlogDetail />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
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
        path: "/settings",
        element: (
          <RequireAuth>
            <Settings />
          </RequireAuth>
        )
      },
      // Admin Routes
      {
        path: "/admin",
        element: (
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        ),
      },
      {
        path: "/admin/dashboard",
        element: (
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        ),
      },
    ],
  },
]);

export default function App() {
  return (
    <UrlProvider>
      <BanCheckWrapper>
        <RouterProvider router={router} />
      </BanCheckWrapper>
    </UrlProvider>
  )
}