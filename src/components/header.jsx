import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { logout } from "@/db/apiAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link2, LogOut, Settings, Shield, LayoutDashboard, Menu, X, ChevronRight } from 'lucide-react'
import { UrlState } from '@/context'
import useFetch from '@/hooks/use-fetch'
import { BarLoader } from 'react-spinners';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, fetchUser } = UrlState()
  const { loading, fn: fnLogout } = useFetch(logout)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdmin = user?.email === 'arisewebx@gmail.com' || user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin';

  const handleLogout = async () => {
    try {
      await fnLogout();
      setMobileOpen(false);
      window.location.href = '/auth';
    } catch {
      window.location.href = '/auth';
    }
  }

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...(isAdmin ? [{ to: "/admin", label: "Admin panel", icon: Shield, admin: true }] : []),
    { to: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <>
      <nav className="py-3 px-4 sm:px-6 flex justify-between items-center bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/icon.png" alt="AriseLinkX" className="w-10 h-10 rounded-lg object-contain scale-110" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">AriseLinkX</span>
        </Link>

        {/* Desktop user section */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <Button
              onClick={() => navigate("/auth")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 h-9 rounded-lg"
            >
              Sign in
            </Button>
          ) : (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="flex items-center gap-2.5 outline-none">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {user?.user_metadata?.name || 'User'}
                    {isAdmin && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-medium">
                        Admin
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Avatar className="w-9 h-9 border-2 border-gray-200 hover:border-orange-300 transition-colors">
                  <AvatarImage src={user?.user_metadata?.profilepic} className="object-cover" />
                  <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-sm">
                    {user?.user_metadata?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-52 mt-2 bg-white border border-gray-200 shadow-lg rounded-xl p-1" align="end">
                <DropdownMenuLabel className="pb-2 px-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={user?.user_metadata?.profilepic} className="object-cover" />
                      <AvatarFallback className="bg-orange-100 text-orange-600 text-xs font-semibold">
                        {user?.user_metadata?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[130px]">{user?.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-100 my-1" />

                {navLinks.map((item) => (
                  <DropdownMenuItem key={item.to} asChild className="cursor-pointer rounded-lg focus:bg-gray-50 px-2 py-2">
                    <Link to={item.to} className="flex items-center gap-2.5 text-gray-700 text-sm">
                      <item.icon className={`h-4 w-4 ${item.admin ? 'text-orange-400' : 'text-gray-400'}`} />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="bg-gray-100 my-1" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer rounded-lg focus:bg-red-50 text-red-600 flex items-center gap-2.5 px-2 py-2 text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-2">
          {!user ? (
            <Button
              onClick={() => navigate("/auth")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 h-8 text-sm rounded-lg"
            >
              Sign in
            </Button>
          ) : (
            <Avatar className="w-8 h-8 border-2 border-gray-200">
              <AvatarImage src={user?.user_metadata?.profilepic} className="object-cover" />
              <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
                {user?.user_metadata?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {mobileOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </nav>

      {loading && <BarLoader width="100%" color="#f97316" height={2} />}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-in panel */}
          <div className="fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl md:hidden flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src="/icon.png" alt="AriseLinkX" className="w-9 h-9 rounded-lg object-contain scale-110" />
                <span className="text-lg font-bold text-gray-900 tracking-tight">AriseLinkX</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {user ? (
              <>
                {/* User info */}
                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-11 h-11 border-2 border-orange-100">
                      <AvatarImage src={user?.user_metadata?.profilepic} className="object-cover" />
                      <AvatarFallback className="bg-orange-100 text-orange-600 font-bold">
                        {user?.user_metadata?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.user_metadata?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nav links */}
                <div className="flex-1 px-3 py-3 space-y-1">
                  {navLinks.map((item) => {
                    const active = location.pathname === item.to
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3 py-3 rounded-xl transition-colors ${
                          active
                            ? 'bg-orange-50 text-orange-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            active ? 'bg-orange-100' : 'bg-gray-100'
                          }`}>
                            <item.icon className={`w-4 h-4 ${item.admin ? 'text-orange-500' : active ? 'text-orange-500' : 'text-gray-500'}`} />
                          </div>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${active ? 'text-orange-400' : 'text-gray-300'}`} />
                      </Link>
                    )
                  })}
                </div>

                {/* Logout */}
                <div className="px-3 pb-6 pt-2 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-sm font-medium">Sign out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5">
                <p className="text-sm text-gray-500 text-center">Sign in to manage your short links</p>
                <Button
                  onClick={() => { navigate("/auth"); setMobileOpen(false); }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-11 rounded-xl"
                >
                  Sign in
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default Header
