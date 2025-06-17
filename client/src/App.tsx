import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import UploadSection from './components/UploadSection';
import InstrumentSelector from './components/InstrumentSelector';
import TranspositionResults from './components/TranspositionResults';
import Footer from './components/Footer';

function App() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'select' | 'process' | 'results'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState<string>('');
  const [sourceKey, setSourceKey] = useState<string>('C');

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setCurrentStep('select');
  };

  const handleInstrumentSelect = (instrument: string) => {
    setSelectedInstrument(instrument);
    setCurrentStep('process');
    
    // Automatically move to results after processing starts
    setTimeout(() => {
      setCurrentStep('results');
    }, 100);
  };

  const resetFlow = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setSelectedInstrument('');
    setSourceKey('C');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentStep === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Hero />
            <UploadSection onFileUpload={handleFileUpload} />
          </motion.div>
        )}

        {currentStep === 'select' && uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <InstrumentSelector
              uploadedFile={uploadedFile}
              sourceKey={sourceKey}
              onSourceKeyChange={setSourceKey}
              onInstrumentSelect={handleInstrumentSelect}
              onBack={() => setCurrentStep('upload')}
            />
          </motion.div>
        )}

        {(currentStep === 'process' || currentStep === 'results') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <TranspositionResults
              fileName={uploadedFile?.name || ''}
              sourceKey={sourceKey}
              targetInstrument={selectedInstrument}
              isProcessing={currentStep === 'process'}
              uploadedFile={uploadedFile}
              onReset={resetFlow}
              onBack={() => setCurrentStep('select')}
            />
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;