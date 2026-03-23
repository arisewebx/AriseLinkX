import Header from '@/components/header'
import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Link2 } from 'lucide-react'

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <ScrollToTop />
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
              <Link2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">AriseLinkX</span>
          </div>

          <p className="text-sm text-gray-500">
            Built by{' '}
            <a
              href="https://karthickofficial.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Karthick
            </a>
            {' '}· © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout
