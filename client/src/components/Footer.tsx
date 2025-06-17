import React from 'react';
import { Music, Heart, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                  MISHPOSE
                </h3>
                <p className="text-sm text-gray-600 -mt-1">Music Transposer</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Professional music transposition made simple. Transform your sheet music 
              across any instrument with AI-powered accuracy and speed.
            </p>
            <div className="flex items-center space-x-4">
              <Github className="h-5 w-5 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
              <Mail className="h-5 w-5 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">API</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Integrations</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © 2025 MISHPOSE. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for musicians worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;