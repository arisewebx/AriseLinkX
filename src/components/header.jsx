import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {logout} from "@/db/apiAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LinkIcon, LogOut, Sparkles, User, Settings, Shield } from 'lucide-react'
import { UrlState } from '@/context'
import useFetch from '@/hooks/use-fetch'
import { BarLoader } from 'react-spinners';

const Header = () => {
  const navigate = useNavigate()
  const {user, fetchUser} = UrlState()
  const {loading, fn: fnLogout} = useFetch(logout)
  
  // Check if user is admin (matching backend logic from apiAdmin.js)
  const isAdmin = user?.email === 'karthickrajaofficial12@gmail.com' || user?.user_metadata?.role === 'admin';
  
  return (
    <>
      <nav className='relative z-50 py-4 px-8 flex justify-between items-center bg-slate-900/95 backdrop-blur-xl border-b border-white/10'>
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl w-12 h-12 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
              Shortlinktics
            </h1>
            <p className="text-xs text-gray-400 -mt-1">Next-Gen Links</p>
          </div>
        </Link>

        {/* User Section */}
        <div>
          {!user ? 
            <Button 
              onClick={() => navigate("/auth")}
              className="relative group overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-2">
                <User className="w-4 h-4" />
                Login
              </span>
            </Button>
            : (
              <DropdownMenu>
                <DropdownMenuTrigger className='relative group'>
                  <div className="flex items-center gap-3 p-1">
                    {/* User Info */}
                    <div className="hidden md:block text-right">
                      <p className="text-sm font-medium text-white">
                        {user?.user_metadata?.name || 'User'}
                        {isAdmin && <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">Admin</span>}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                    
                    {/* Avatar with Glow Effect */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                      <Avatar className="relative w-12 h-12 border-2 border-white/20 group-hover:border-purple-400/50 transition-all duration-300">
                        <AvatarImage 
                          src={user?.user_metadata?.profilepic} 
                          className="object-cover" 
                        />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold">
                          {user?.user_metadata?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  className="w-64 mt-2 bg-slate-800/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/20"
                  style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  {/* User Info Header */}
                  <DropdownMenuLabel className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage 
                          src={user?.user_metadata?.profilepic} 
                          className="object-cover" 
                        />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs">
                          {user?.user_metadata?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">
                          {user?.user_metadata?.name || 'User'}
                          {isAdmin && <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">Admin</span>}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  {/* Menu Items */}
                  <DropdownMenuItem className="group cursor-pointer focus:bg-white/5 hover:bg-white/5">
                    <Link to="/dashboard" className="flex items-center w-full text-gray-200 group-hover:text-white transition-colors duration-200">
                      <div className="mr-3 p-1 rounded-md bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors duration-200">
                        <LinkIcon className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">My Links</p>
                        <p className="text-xs text-gray-400">Manage your URLs</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  {/* Admin Menu Item - Only show for admin users */}
                  {isAdmin && (
                    <DropdownMenuItem className="group cursor-pointer focus:bg-white/5 hover:bg-white/5">
                      <Link to="/admin" className="flex items-center w-full text-gray-200 group-hover:text-white transition-colors duration-200">
                        <div className="mr-3 p-1 rounded-md bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors duration-200">
                          <Shield className="h-4 w-4 text-orange-400" />
                        </div>
                        <div>
                          <p className="font-medium">Admin</p>
                          <p className="text-xs text-gray-400">System management</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem className="group cursor-pointer focus:bg-white/5 hover:bg-white/5">
                    <Link to="/settings" className="flex items-center w-full text-gray-200 group-hover:text-white transition-colors duration-200">
                      <div className="flex items-center w-full text-gray-200 group-hover:text-white transition-colors duration-200">
                        <div className="mr-3 p-1 rounded-md bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors duration-200">
                          <Settings className="h-4 w-4 text-cyan-400" />
                        </div>
                        <div>
                          <p className="font-medium">Settings</p>
                          <p className="text-xs text-gray-400">Account preferences</p>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  <DropdownMenuItem
                    onClick={() => {
                      fnLogout().then(() => {
                        fetchUser();
                        navigate("/auth");
                      });
                    }}
                    className="group cursor-pointer focus:bg-red-500/10 hover:bg-red-500/10 text-red-400"
                  >
                    <div className="flex items-center w-full">
                      <div className="mr-3 p-1 rounded-md bg-red-500/20 group-hover:bg-red-500/30 transition-colors duration-200">
                        <LogOut className="h-4 w-4 text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium">Sign Out</p>
                        <p className="text-xs text-red-400/70">End your session</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          }
        </div>
      </nav>
      
      {/* Enhanced Loading Bar */}
      {loading && (
        <div className="relative">
          <BarLoader 
            width="100%" 
            color="#8b5cf6" 
            height={3}
            className="absolute top-0 left-0"
          />
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 opacity-50 animate-pulse"></div>
        </div>
      )}
    </>
  )
}

export default Header