import Header from '@/components/header'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Heart, Code, Sparkles } from 'lucide-react'

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-cyan-900/10"></div>
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-30"
          style={{background: 'rgba(168, 85, 247, 0.2)'}}
        ></div>
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-30"
          style={{background: 'rgba(6, 182, 212, 0.2)', animationDelay: '2s'}}
        ></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-16 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-20 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-60" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-ping opacity-40" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-purple-300 rounded-full animate-ping opacity-50" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Main Content */}
      <main className='relative z-10 min-h-screen'>
        <Header/>
        
        {/* Content Area */}
        <div className="relative">
          <Outlet/>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative z-10 mt-20">
        {/* Gradient Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-8"></div>
        
        <div 
          className="p-8 text-center relative overflow-hidden"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Footer Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20"></div>
          <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
          
          {/* Footer Content */}
          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Made By Section */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-gray-300 text-sm">Crafted with</span>
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-gray-300 text-sm">by</span>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/10">
                  <Code className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-white">Karthick</span>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                Building the future of link management with modern web technologies and beautiful design.
              </p>
            </div>

            {/* Tech Stack */}
            <div className="mb-6">
              <div className="flex flex-wrap justify-center gap-3">
                {['React', 'Tailwind CSS', 'Lucide Icons', 'Modern UI'].map((tech, index) => (
                  <div 
                    key={tech}
                    className="px-3 py-1 text-xs font-medium text-gray-300 rounded-full border border-white/10"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            {/* <div className="flex flex-wrap justify-center gap-6 mb-6">
              <button className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm font-medium">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium">
                Terms of Service
              </button>
              <button className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium">
                Contact
              </button>
              <button className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm font-medium">
                GitHub
              </button>
            </div> */}

            {/* Copyright */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-400 text-sm">
                    © 2025 LinkFlow. All rights reserved.
                  </span>
                </div>
                
                <div className="text-xs text-gray-500">
                  Version 2.0.0 • Built with ❤️
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements in Footer */}
          <div className="absolute bottom-4 left-8 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-30"></div>
          <div className="absolute top-4 right-8 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-30" style={{animationDelay: '1s'}}></div>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout