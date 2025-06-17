import React from 'react';
import { motion } from 'framer-motion';
import { Music2, Zap, Shield, Users } from 'lucide-react';

const Hero: React.FC = () => {
  const features = [
    {
      icon: Music2,
      title: 'Professional Accuracy',
      description: 'Advanced music recognition with 99.9% note accuracy'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Transpose complex scores in seconds, not hours'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your music files are processed securely and deleted after use'
    },
    {
      icon: Users,
      title: 'Trusted by Musicians',
      description: 'Used by orchestras, bands, and solo artists worldwide'
    }
  ];

  return (
    <div className="text-center py-16 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Transform Your Sheet Music
          <span className="block bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Across Any Instrument
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Automatically transpose PDF sheet music from concert pitch to any instrument key. 
          Professional-grade accuracy with the simplicity of drag and drop.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
            >
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;