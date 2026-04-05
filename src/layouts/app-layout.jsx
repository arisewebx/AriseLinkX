import Header from '@/components/header'
import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Link2 } from 'lucide-react'

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);
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
            <img src="/icon.png" alt="AriseLinkX" className="w-8 h-8 rounded object-contain scale-110" />
            <span className="text-base font-semibold text-gray-900">AriseLinkX</span>
          </div>

          <p className="text-sm text-gray-500">
            Built by{' '}
            <a
              href="https://arisewebx.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              ArisewebX
            </a>
            {' '}· © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout
