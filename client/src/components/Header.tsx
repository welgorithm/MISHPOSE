import React from 'react';
import { Music, Github, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl">
              <Music className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                MISHPOSE
              </h1>
              <p className="text-sm text-gray-600 -mt-1">Music Transposer</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Pricing
            </a>
            <div className="flex items-center space-x-4">
              <Github className="h-5 w-5 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
            </div>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;