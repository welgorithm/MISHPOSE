import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Music, Volume2 } from 'lucide-react';

interface InstrumentSelectorProps {
  uploadedFile: File;
  sourceKey: string;
  onSourceKeyChange: (key: string) => void;
  onInstrumentSelect: (instrument: string) => void;
  onBack: () => void;
}

const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({
  uploadedFile,
  sourceKey,
  onSourceKeyChange,
  onInstrumentSelect,
  onBack
}) => {
  const [selectedInstrument, setSelectedInstrument] = useState<string>('');

  const keys = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];

  const instrumentCategories = [
    {
      name: 'Woodwinds',
      instruments: [
        { name: 'Bb Clarinet', key: 'Bb', transpose: '+2' },
        { name: 'Eb Alto Saxophone', key: 'Eb', transpose: '+6' },
        { name: 'Bb Tenor Saxophone', key: 'Bb', transpose: '+2' },
        { name: 'Eb Baritone Saxophone', key: 'Eb', transpose: '+6' },
        { name: 'Bb Soprano Saxophone', key: 'Bb', transpose: '+2' },
        { name: 'F French Horn', key: 'F', transpose: '+7' },
      ]
    },
    {
      name: 'Brass',
      instruments: [
        { name: 'Bb Trumpet', key: 'Bb', transpose: '+2' },
        { name: 'Bb Flugelhorn', key: 'Bb', transpose: '+2' },
        { name: 'Bb Trombone', key: 'Bb', transpose: '+2' },
        { name: 'Eb Tuba', key: 'Eb', transpose: '+6' },
        { name: 'F Tuba', key: 'F', transpose: '+7' },
        { name: 'Bb Euphonium', key: 'Bb', transpose: '+2' },
      ]
    },
    {
      name: 'Strings',
      instruments: [
        { name: 'Violin', key: 'C', transpose: '0' },
        { name: 'Viola', key: 'C', transpose: '0' },
        { name: 'Cello', key: 'C', transpose: '0' },
        { name: 'Double Bass', key: 'C', transpose: '-12' },
        { name: 'Guitar', key: 'C', transpose: '-12' },
        { name: 'Bass Guitar', key: 'C', transpose: '-12' },
      ]
    }
  ];

  const handleInstrumentClick = (instrument: string) => {
    setSelectedInstrument(instrument);
  };

  const handleContinue = () => {
    if (selectedInstrument) {
      onInstrumentSelect(selectedInstrument);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Upload</span>
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Select Target Instrument
            </h2>
            <p className="text-gray-600">
              Choose the instrument you want to transpose your music for
            </p>
          </div>
          
          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Music className="h-5 w-5 mr-2" />
                Source Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Uploaded File
                  </label>
                  <p className="text-sm text-gray-600 bg-white rounded-lg p-3 border truncate">
                    {uploadedFile.name}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source Key
                  </label>
                  <select
                    value={sourceKey}
                    onChange={(e) => onSourceKeyChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {keys.map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-6">
              {instrumentCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Volume2 className="h-5 w-5 mr-2 text-blue-600" />
                    {category.name}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.instruments.map((instrument) => (
                      <motion.button
                        key={instrument.name}
                        onClick={() => handleInstrumentClick(instrument.name)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                          selectedInstrument === instrument.name
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">{instrument.name}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            selectedInstrument === instrument.name
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {instrument.key}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Transpose {instrument.transpose} semitones
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {selectedInstrument && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
            >
              Start Transposition for {selectedInstrument}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default InstrumentSelector;